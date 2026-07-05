"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";

import { AuthForm } from "@/components/chat/auth-form";
import { SubmitButton } from "@/components/chat/submit-button";
import { toast } from "@/components/chat/toast";
import { type RegisterActionState, register } from "../actions";

export default function Page() {
  const router = useRouter();
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    { status: "idle" }
  );

  const { update: updateSession } = useSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: router and updateSession are stable refs
  useEffect(() => {
    if (state.status === "user_exists") {
      toast({ type: "error", description: "Konto existiert bereits!" });
    } else if (state.status === "failed") {
      toast({ type: "error", description: "Konto konnte nicht erstellt werden." });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Eingabe konnte nicht validiert werden.",
      });
    } else if (state.status === "success") {
      toast({ type: "success", description: "Zugang erstellt!" });
      setIsSuccessful(true);
      updateSession();
      router.refresh();
    }
  }, [state.status]);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Zugang erstellen</h1>
      <p className="text-sm text-muted-foreground">LV.AI Passwort eingeben</p>
      <AuthForm action={formAction}>
        <SubmitButton isSuccessful={isSuccessful}>Zugang</SubmitButton>
        <p className="text-center text-[13px] text-muted-foreground">
          {"Bereits Zugang? "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/login"
          >
            Anmelden
          </Link>
        </p>
      </AuthForm>
    </>
  );
}
