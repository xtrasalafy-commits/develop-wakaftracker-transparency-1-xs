"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DEMO_ACCOUNTS } from "@/lib/constants";

export function LoginPanel() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "";
  const [email, setEmail] = useState("siti@wakaftracker.id");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function login(targetEmail: string) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Gagal masuk");
        return;
      }
      const fallback = json.user?.role === "ADMIN_NAZHIR" ? "/admin" : "/wakif";
      router.push(next || fallback);
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_20px_50px_rgba(6,36,28,0.08)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Portal demo</p>
      <h1 className="mt-2 font-display text-4xl text-forest">Masuk WakafTracker</h1>
      <p className="mt-2 text-sm text-muted">
        Pilih akun demo nazhir atau wakif. Tidak ada kata sandi — sesi disimpan di cookie httpOnly.
      </p>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void login(email);
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-forest/15 px-4 py-3 text-sm outline-none focus:border-gold"
          placeholder="email@wakaftracker.id"
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-forest py-3 text-sm font-semibold text-ivory disabled:opacity-60"
        >
          {pending ? "Masuk…" : "Masuk dengan email"}
        </button>
      </form>
      <div className="mt-6 grid gap-2">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => {
              setEmail(account.email);
              void login(account.email);
            }}
            className="flex items-center justify-between rounded-2xl border border-forest/10 px-4 py-3 text-left hover:border-gold/60"
          >
            <span>
              <span className="block text-sm font-semibold text-forest">{account.name}</span>
              <span className="text-xs text-muted">{account.email}</span>
            </span>
            <span className="rounded-full bg-mint px-2 py-0.5 text-[11px] font-semibold text-leaf">{account.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
