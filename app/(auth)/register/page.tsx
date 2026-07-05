"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// LV.AI: Keine Registrierung nötig — Redirect zu Login
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}
