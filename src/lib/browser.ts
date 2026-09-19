import { apiUrl, APP_CONFIG } from "./config";

export type BrowserRunResult = {
  text: string;
  status?: string;
  liveUrl?: string;
};

export async function runBrowserWorkflow(task: string): Promise<BrowserRunResult> {
  if (!APP_CONFIG.apiBaseUrl) {
    throw new Error("Browser Use is not connected. Set VITE_API_BASE_URL to the production API.");
  }

  const response = await fetch(apiUrl("/api/browser/run"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });

  const body = (await response.json().catch(() => ({}))) as {
    text?: string;
    status?: string;
    liveUrl?: string;
    error?: string;
  };

  if (!response.ok) throw new Error(body.error || `Browser workflow failed (${response.status}).`);
  return {
    text: body.text || "Browser workflow completed.",
    status: body.status,
    liveUrl: body.liveUrl,
  };
}
