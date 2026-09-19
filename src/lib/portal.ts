import { apiUrl, APP_CONFIG } from "./config";
import { getSessionToken } from "./auth";
import { LIMITED_OFFERS } from "../data/visaServices";

export type PortalDocument = {
  id: string;
  title: string;
  description: string;
  url: string;
  kind: "pdf" | "artifact";
};

export type PortalSummary = {
  notice: string;
  offers: typeof LIMITED_OFFERS;
  documents: PortalDocument[];
  googleClientId?: string;
};

const fallback: PortalSummary = {
  notice: "Official-source verification and human review are required before any submission.",
  offers: LIMITED_OFFERS,
  documents: [{ id: "insus-guide", title: "INSUS Visa Operations service guide", description: "Client journey, document workflow, advisor gate and operational overview.", url: "/insus-service-guide.pdf", kind: "pdf" }],
};

export async function getPortalSummary(): Promise<PortalSummary> {
  if (!APP_CONFIG.apiBaseUrl) return fallback;
  const response = await fetch(apiUrl("/api/portal/summary"), { headers: { Authorization: `Bearer ${getSessionToken("client")}` } });
  const body = (await response.json().catch(() => ({}))) as Partial<PortalSummary> & { error?: string };
  if (!response.ok) throw new Error(body.error || "Client services could not be loaded.");
  return { ...fallback, ...body, offers: Array.isArray(body.offers) ? body.offers : fallback.offers, documents: Array.isArray(body.documents) ? body.documents : fallback.documents };
}
