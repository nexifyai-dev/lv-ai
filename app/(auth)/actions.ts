"use server";

import { z } from "zod";

import { createUser, getUser } from "@/lib/db/queries";

import { signIn } from "./auth";

// LV.AI: Passwort-Gate — nur Passwort nötig, kein Email-Feld
const loginSchema = z.object({
  password: z.string().min(1, "Passwort erforderlich"),
});

export type LoginActionState = {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
};

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = loginSchema.parse({
      password: formData.get("password"),
    });

    await signIn("credentials", {
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export type RegisterActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
};

// LV.AI: Register = Login (gleiches Passwort-Gate)
export const register = login;
