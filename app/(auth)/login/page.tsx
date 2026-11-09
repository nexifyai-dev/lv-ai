"use client";

import { useState } from "react";

export default function Page() {
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
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // WICHTIG: Vollständiger Page-Reload statt router.push()
        // Damit der Proxy den neuen Session-Cookie sieht
        window.location.href = "/";
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
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-xl font-bold">
              LV
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">LV.AI</h1>
          <p className="text-muted-foreground text-center text-sm">
            Autonomer KI-Experte für Leistungsverzeichnisse
            <br />
            Ausschreibung · Vergabe · Abrechnung
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              className="text-muted-foreground text-sm font-normal"
              htmlFor="password"
            >
              Zugangspasswort
            </label>
            <input
              autoFocus
              className="border-border/50 bg-muted/50 focus:border-foreground/20 focus:bg-muted h-10 rounded-lg border px-3 py-1 text-sm transition-colors focus:outline-none"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type="password"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Wird eingeloggt..." : "Zugang"}
          </button>
        </form>

        <p className="text-muted-foreground mt-4 text-center text-[12px]">
          D/A/CH · GAEB DA XML · VOB · ÖNORM · SIA
        </p>
      </div>
    </div>
  );
}
