import { NextResponse } from "next/server";
import { auth, signIn } from "@/app/(auth)/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Passwort erforderlich" }, { status: 400 });
    }

    // Direkt signIn aufrufen
    const result = await signIn("credentials", {
      password,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json({ error: "Ungültiges Passwort" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login fehlgeschlagen" }, { status: 500 });
  }
}
