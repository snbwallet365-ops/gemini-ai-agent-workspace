import { useEffect, useState } from "react";
import { generateClientPin, getAdminOverview, saveAdminSettings, savePortalNotice, type AdminSettings } from "../lib/admin";
import { APP_CONFIG } from "../lib/config";

type Overview = {
  activeClients: number;
  configured: Record<string, boolean>;
  notice: string;
};

const emptySettings: AdminSettings = {
  primaryAiKey: "",
  exaApiKey: "",
  browserUseApiKey: "",
  whatsappToken: "",
  whatsappPhoneId: "",
};

export function AdminConsole({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"connections" | "sessions" | "controls">("connections");
  const [settings, setSettings] = useState<AdminSettings>(emptySettings);
  const [overview, setOverview] = useState<Overview>({ activeClients: 0, configured: {}, notice: "" });
  const [notice, setNotice] = useState("");
  const [newPin, setNewPin] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    try {
      setOverview(await getAdminOverview());
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Overview unavailable.");
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const saveConnections = async () => {
    setBusy(true);
    setMessage("");
    try {
      await saveAdminSettings(settings);
      setMessage(APP_CONFIG.apiBaseUrl ? "Secure server key-store updated." : "Preview key-store updated for this session only.");
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Connection settings could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const rotatePin = async () => {
    setBusy(true);
    try {
      setNewPin(await generateClientPin());
      setMessage("New client access code generated. Share it through a secure channel.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Client PIN generation failed.");
    } finally {
      setBusy(false);
    }
  };

  const saveNotice = async () => {
    setBusy(true);
    try {
      await savePortalNotice(notice);
      setMessage("Portal notice saved.");
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Notice could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const field = (label: string, key: keyof AdminSettings, placeholder: string) => (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-neutral-600">{label}</span>
      <input type="password" value={settings[key]} placeholder={placeholder} onChange={(event) => setSettings((current) => ({ ...current, [key]: event.target.value }))} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#1473ff]" />
    </label>
  );

  return (
    <main className="min-h-dvh bg-[#d8d8d8] p-0 sm:p-4">
      <section className="mx-auto flex min-h-dvh max-w-[1320px] flex-col overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:min-h-[calc(100dvh-32px)] sm:rounded-2xl">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 px-5 py-4 sm:px-7">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.18em] text-[#1473ff] uppercase">VisaMOTion AI</div>
            <h1 className="mt-1 font-serif text-[2rem] leading-none text-neutral-900">Master control</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] text-emerald-700">{APP_CONFIG.apiBaseUrl ? "Production API" : "Preview mode"}</span>
            <button type="button" onClick={onLogout} className="rounded-lg px-3 py-2 text-[12.5px] text-neutral-600 hover:bg-black/5">Lock console</button>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-black/8 bg-[#f6f6f6] p-3 md:w-56 md:flex-col md:border-r md:border-b-0">
            {(["connections", "sessions", "controls"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setTab(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-[13px] capitalize ${tab === item ? "bg-[#1473ff] font-medium text-white" : "text-neutral-600 hover:bg-black/5"}`}>
                {item === "connections" ? "API key-store" : item === "sessions" ? "Live supervision" : "Client controls"}
              </button>
            ))}
          </nav>
          <div className="min-w-0 flex-1 overflow-auto p-5 sm:p-8">
            {tab === "connections" && (
              <div className="animate-soft-in max-w-2xl">
                <h2 className="text-[18px] font-semibold text-neutral-900">Secure connections</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">Secrets are sent only to the protected server when the production API is configured. They are never shown back in the browser.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {field("Primary AI provider key", "primaryAiKey", "provider key")}
                  {field("Exa search key", "exaApiKey", "exa-...")}
                  {field("Browser Use Cloud key", "browserUseApiKey", "browser key")}
                  {field("WhatsApp permanent token", "whatsappToken", "system token")}
                  {field("WhatsApp phone number ID", "whatsappPhoneId", "phone ID")}
                </div>
                <button type="button" onClick={saveConnections} disabled={busy} className="mt-5 rounded-xl bg-[#1473ff] px-4 py-2.5 text-[13px] font-medium text-white disabled:opacity-50">{busy ? "Saving..." : "Save key-store"}</button>
                <div className="mt-7 rounded-2xl border border-black/8 bg-[#f7f7f7] p-4 text-[12px] text-neutral-600">
                  <div className="mb-2 font-medium text-neutral-800">Connection status</div>
                  {Object.entries({ ai: "Primary AI", exa: "Exa search", browser: "Browser Use", whatsapp: "WhatsApp Cloud" }).map(([key, label]) => <div key={key} className="flex justify-between py-1"><span>{label}</span><span className={overview.configured[key] ? "text-emerald-600" : "text-neutral-400"}>{overview.configured[key] ? "Configured" : "Not configured"}</span></div>)}
                </div>
              </div>
            )}
            {tab === "sessions" && (
              <div className="animate-soft-in max-w-2xl">
                <h2 className="text-[18px] font-semibold text-neutral-900">Live user supervision</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">Monitor authenticated client sessions and keep intervention available before any sensitive submission.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#eef5ff] p-4"><div className="text-2xl font-semibold text-[#1473ff]">{overview.activeClients}</div><div className="mt-1 text-[12px] text-neutral-500">Active clients</div></div>
                  <div className="rounded-2xl bg-[#f2f8ec] p-4"><div className="text-2xl font-semibold text-emerald-700">{overview.configured.browser ? "ON" : "OFF"}</div><div className="mt-1 text-[12px] text-neutral-500">Browser agent</div></div>
                  <div className="rounded-2xl bg-[#fff7e7] p-4"><div className="text-2xl font-semibold text-amber-700">Human</div><div className="mt-1 text-[12px] text-neutral-500">Approval gate</div></div>
                </div>
                <button type="button" onClick={() => void refresh()} className="mt-5 rounded-xl border border-black/10 px-4 py-2.5 text-[13px] text-neutral-700 hover:bg-black/5">Refresh live sessions</button>
                <div className="mt-4 rounded-2xl border border-black/8 p-4 text-[13px] text-neutral-600">{overview.notice || "No portal notice is currently published."}</div>
              </div>
            )}
            {tab === "controls" && (
              <div className="animate-soft-in max-w-2xl space-y-7">
                <div>
                  <h2 className="text-[18px] font-semibold text-neutral-900">Client access and portal notice</h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">Generate a replacement client PIN or publish a short notice to the protected portal.</p>
                  <button type="button" onClick={rotatePin} disabled={busy} className="mt-4 rounded-xl bg-[#1473ff] px-4 py-2.5 text-[13px] font-medium text-white disabled:opacity-50">Generate client PIN</button>
                  {newPin && <div className="mt-3 rounded-xl bg-[#eef5ff] px-4 py-3 text-[18px] font-semibold tracking-[0.25em] text-[#1473ff]">{newPin}</div>}
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-neutral-600" htmlFor="portal-notice">Portal notice</label>
                  <textarea id="portal-notice" rows={4} value={notice} onChange={(event) => setNotice(event.target.value)} placeholder="Example: biometric appointments are being reviewed today." className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-[13px] outline-none focus:border-[#1473ff]" />
                  <button type="button" onClick={saveNotice} disabled={busy} className="mt-3 rounded-xl border border-black/10 px-4 py-2.5 text-[13px] text-neutral-700 hover:bg-black/5 disabled:opacity-50">Save notice</button>
                </div>
              </div>
            )}
            {message && <div className="mt-6 max-w-2xl rounded-xl bg-[#f7f7f7] px-3 py-2 text-[12.5px] text-neutral-600">{message}</div>}
          </div>
        </div>
      </section>
    </main>
  );
}
