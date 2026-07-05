"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";

import { AuthForm } from "@/components/chat/auth-form";
import { SubmitButton } from "@/components/chat/submit-button";
import { toast } from "@/components/chat/toast";
import { type LoginActionState, login } from "../actions";

export default function Page() {
  const router = useRouter();
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    { status: "idle" }
  );

  const { update: updateSession } = useSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: router and updateSession are stable refs
  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: "Ungültiges Passwort. Bitte erneut versuchen.",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Eingabe konnte nicht validiert werden.",
      });
    } else if (state.status === "success") {
      setIsSuccessful(true);
      updateSession();
      router.refresh();
    }
  }, [state.status]);

  return (
    <>
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl">LV</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">LV.AI</h1>
        <p className="text-sm text-muted-foreground text-center">
          Autonomer KI-Experte für Leistungsverzeichnisse
          <br />
          Ausschreibung · Vergabe · Abrechnung
        </p>
      </div>

      <AuthForm action={formAction}>
        <SubmitButton isSuccessful={isSuccessful}>Zugang</SubmitButton>
      </AuthForm>

      <p className="text-center text-[12px] text-muted-foreground mt-4">
        D/A/CH · GAEB DA XML · VOB · ÖNORM · SIA
      </p>
    </>
  );
}
