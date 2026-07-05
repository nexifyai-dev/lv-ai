import { compare } from "bcrypt-ts";
import NextAuth, { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { DUMMY_PASSWORD } from "@/lib/constants";
import { createGuestUser, getUser } from "@/lib/db/queries";
import { authConfig } from "./auth.config";

export type UserType = "guest" | "regular";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
  }
}

// LV.AI Passwort-Gate — Einfaches Passwort für MVP
// Später: Ersetzt durch echtes Multi-User Auth (Magic Link / Passkey)
const LV_GATE_PASSWORD = process.env.LV_PASSWORD || "LV2026!!";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    // Passwort-Gate — LV2026!! für Zugang
    Credentials({
      credentials: {
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        const password = String(credentials?.password ?? "");

        // Prüfe gegen LV-Gate-Passwort
        if (password === LV_GATE_PASSWORD) {
          // Erstelle oder hole Gate-User
          const email = "admin@lv-ai.local";
          const users = await getUser(email);

          if (users.length > 0) {
            return { ...users[0], type: "regular" };
          }

          // Fallback: Guest-User wenn kein Admin existiert
          const [guestUser] = await createGuestUser();
          return { ...guestUser, type: "regular" };
        }

        return null;
      },
    }),
    // Guest-Zugang (ohne Passwort)
    Credentials({
      id: "guest",
      credentials: {},
      async authorize() {
        const [guestUser] = await createGuestUser();
        return { ...guestUser, type: "guest" };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.type = user.type;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
      }

      return session;
    },
  },
});
