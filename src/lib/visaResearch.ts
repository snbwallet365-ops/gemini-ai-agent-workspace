import { apiUrl, APP_CONFIG } from "./config";

export async function runVisaResearch(task: string) {
  if (!APP_CONFIG.apiBaseUrl) throw new Error("Live visa verification needs the production agent API.");
  const response = await fetch(apiUrl("/api/visa/research"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });
  const body = (await response.json().catch(() => ({}))) as { text?: string; error?: string };
  if (!response.ok) throw new Error(body.error || `Visa research failed (${response.status}).`);
  return body.text || "No verified visa research was returned.";
}
