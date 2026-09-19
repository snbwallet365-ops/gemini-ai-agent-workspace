import { FormEvent, useState } from "react";
import { authenticate, type AccessRole } from "../lib/auth";

export function AccessGate({ role, onUnlock }: { role: AccessRole; onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const admin = role === "admin";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await authenticate(role, pin);
      onUnlock();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Access code was not accepted.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#d8d8d8] px-4 py-8">
      <section className="animate-soft-in w-full max-w-sm rounded-[28px] bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.16)] ring-1 ring-black/8 sm:p-9">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1473ff] text-lg font-bold text-white">V</span>
          <div>
            <div className="text-[16px] font-semibold tracking-tight">VisaMOTion AI</div>
            <div className="text-[12px] text-neutral-400">{admin ? "Master control" : "Client portal"}</div>
          </div>
        </div>
        <h1 className="font-serif text-[2rem] leading-tight text-neutral-900">{admin ? "Admin access" : "Welcome back"}</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-500">
          Enter your {admin ? "master" : "client"} access code to open the protected workspace.
        </p>
        <form className="mt-7 space-y-3" onSubmit={submit}>
          <label className="block text-[12px] font-medium text-neutral-600" htmlFor="access-pin">Access code</label>
          <input
            id="access-pin"
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={12}
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-center text-[20px] tracking-[0.35em] outline-none focus:border-[#1473ff]"
            placeholder="••••••"
            autoFocus
          />
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-[12.5px] text-red-700">{error}</p>}
          <button type="submit" disabled={busy || pin.length < 4} className="w-full rounded-xl bg-[#1473ff] px-4 py-3 text-[13px] font-medium text-white shadow-sm disabled:opacity-45">
            {busy ? "Checking..." : "Unlock workspace"}
          </button>
        </form>
        <p className="mt-6 text-center text-[11px] leading-relaxed text-neutral-400">Protected client and administration workspace</p>
      </section>
    </main>
  );
}
