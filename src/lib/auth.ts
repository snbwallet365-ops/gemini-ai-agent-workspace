import { apiUrl, APP_CONFIG } from "./config";

export type AccessRole = "client" | "admin";

const CLIENT_PIN = "666085";
const ADMIN_PIN = "132313";

function tokenKey(role: AccessRole) {
  return `visamotion.session.${role}`;
}

export function hasStoredSession(role: AccessRole) {
  try {
    return Boolean(sessionStorage.getItem(tokenKey(role)));
  } catch {
    return false;
  }
}

export function getSessionToken(role: AccessRole) {
  try {
    return sessionStorage.getItem(tokenKey(role)) || "";
  } catch {
    return "";
  }
}

export function clearSession(role: AccessRole) {
  try {
    sessionStorage.removeItem(tokenKey(role));
  } catch {
    /* Ignore private browsing storage errors. */
  }
}

export async function authenticate(role: AccessRole, pin: string) {
  if (APP_CONFIG.apiBaseUrl) {
    const response = await fetch(apiUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, pin }),
    });
    const body = (await response.json().catch(() => ({}))) as { token?: string; error?: string };
    if (!response.ok || !body.token) throw new Error(body.error || "Access code was not accepted.");
    sessionStorage.setItem(tokenKey(role), body.token);
    return true;
  }

  const accepted = role === "admin" ? pin === ADMIN_PIN : pin === CLIENT_PIN;
  if (!accepted) throw new Error("That access code is not correct.");
  sessionStorage.setItem(tokenKey(role), `preview-${role}-${Date.now()}`);
  return true;
}
