"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Login fehlgeschlagen");
      }
    } catch {
      setError("Verbindungsfehler");
    } finally {
      setIsLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            className="font-normal text-muted-foreground text-sm"
            htmlFor="password"
          >
            Zugangspasswort
          </label>
          <input
            autoFocus
            className="h-10 rounded-lg border border-border/50 bg-muted/50 px-3 py-1 text-sm transition-colors focus:border-foreground/20 focus:bg-muted focus:outline-none"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? "Wird eingeloggt..." : "Zugang"}
        </button>
      </form>

      <p className="text-center text-[12px] text-muted-foreground mt-4">
        D/A/CH · GAEB DA XML · VOB · ÖNORM · SIA
      </p>
    </>
  );
}
