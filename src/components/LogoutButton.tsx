"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={pending}
      className="text-sm font-medium text-[var(--color-encre-tenue)] hover:text-[var(--color-violet)]"
    >
      {pending ? "…" : "Déconnexion"}
    </button>
  );
}
