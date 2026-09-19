import { apiUrl, APP_CONFIG } from "./config";
import { getSessionToken } from "./auth";

export type AdminSettings = {
  primaryAiKey: string;
  exaApiKey: string;
  browserUseApiKey: string;
  whatsappToken: string;
  whatsappPhoneId: string;
};

export async function saveAdminSettings(settings: AdminSettings) {
  if (!APP_CONFIG.apiBaseUrl) return { stored: "preview-memory" as const };
  const response = await fetch(apiUrl("/api/admin/config"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getSessionToken("admin")}` },
    body: JSON.stringify(settings),
  });
  const body = (await response.json().catch(() => ({}))) as { stored?: string; error?: string };
  if (!response.ok) throw new Error(body.error || "Admin settings could not be saved.");
  return body;
}

export async function getAdminOverview() {
  if (!APP_CONFIG.apiBaseUrl) return { activeClients: 0, configured: {}, notice: "Preview mode: connect the production API for live sessions." };
  const response = await fetch(apiUrl("/api/admin/overview"), { headers: { Authorization: `Bearer ${getSessionToken("admin")}` } });
  const body = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(body.error || "Admin overview could not be loaded.");
  return body as { activeClients: number; configured: Record<string, boolean>; notice: string };
}

export async function generateClientPin() {
  if (!APP_CONFIG.apiBaseUrl) return String(Math.floor(100000 + Math.random() * 900000));
  const response = await fetch(apiUrl("/api/admin/client-pin"), {
    method: "POST",
    headers: { Authorization: `Bearer ${getSessionToken("admin")}` },
  });
  const body = (await response.json().catch(() => ({}))) as { pin?: string; error?: string };
  if (!response.ok || !body.pin) throw new Error(body.error || "A new client PIN could not be generated.");
  return body.pin;
}

export async function savePortalNotice(notice: string) {
  if (!APP_CONFIG.apiBaseUrl) return;
  const response = await fetch(apiUrl("/api/admin/notice"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getSessionToken("admin")}` },
    body: JSON.stringify({ notice }),
  });
  if (!response.ok) throw new Error("Portal notice could not be saved.");
}
