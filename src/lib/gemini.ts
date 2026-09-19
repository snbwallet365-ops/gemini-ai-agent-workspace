import type { ChatMessage, ModelId } from "../types";
import { apiUrl, APP_CONFIG } from "./config";

export const MODELS: { id: ModelId; label: string; hint: string; provider: "google" | "local" }[] = [
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", hint: "Fast agent · default", provider: "google" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", hint: "Deeper reasoning", provider: "google" },
  { id: "kimi-k3-high", label: "Kimi K3 High", hint: "Long-context studio", provider: "local" },
  { id: "kimi-k2", label: "Kimi K2", hint: "Balanced", provider: "local" },
  { id: "gpt-4.1", label: "GPT-4.1", hint: "General", provider: "local" },
];

const SYSTEM = `You are Gemini Workspace, a capable AI agent that lives inside a three-pane workspace. You do real work: research, write, plan, analyze, and produce files.

Style:
- Direct, specific, calm. No filler, no "great question".
- Prefer short paragraphs. Use lists when they help.
- When you make an artifact, describe what you made and any assumptions.
- If a brief is missing a city, hemisphere, budget, or constraint, state the assumption you used.
- You can create multi-page PDFs, itineraries, analyses, and specs.
- For visa-agency work, use official government sources, separate facts from assumptions, protect personal data, never promise approval, and require human review before submission or payment.
- For browser workflows, explain the intended action and stop before irreversible actions unless the user explicitly approved that exact action.

When the user asks for a PDF, document, plan, or research pack, still write a concise delivery note (2–4 sentences) as if the file is attached.`;

export function getApiKey(): string {
  try {
    return localStorage.getItem("bionic.geminiKey") || "";
  } catch {
    return "";
  }
}

export function setApiKey(key: string) {
  localStorage.setItem("bionic.geminiKey", key.trim());
}

export function geminiModelName(id: ModelId): string {
  if (id === "gemini-2.5-pro") return "gemini-2.5-pro";
  return "gemini-2.5-flash";
}

export async function streamGemini(opts: {
  model: ModelId;
  messages: ChatMessage[];
  userText: string;
  apiKey: string;
  onDelta: (chunk: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  if (APP_CONFIG.apiBaseUrl) return streamServerAgent(opts);

  const contents = [
    ...opts.messages.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: opts.userText }] },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModelName(
    opts.model
  )}:streamGenerateContent?key=${encodeURIComponent(opts.apiKey)}&alt=sse`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: opts.signal,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(parseGeminiError(res.status, err));
  }

  if (!res.body) throw new Error("No response stream from Gemini.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n");
    buffer = parts.pop() || "";
    for (const line of parts) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const json = JSON.parse(data);
        const text =
          json.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") ||
          "";
        if (text) {
          full += text;
          opts.onDelta(text);
        }
      } catch {
        /* ignore malformed sse */
      }
    }
  }

  if (!full) {
    const fallback = await generateGeminiOnce(opts);
    if (fallback) {
      opts.onDelta(fallback);
      return fallback;
    }
  }

  return full;
}

async function streamServerAgent(opts: {
  model: ModelId;
  messages: ChatMessage[];
  userText: string;
  onDelta: (chunk: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  const res = await fetch(apiUrl("/api/agent/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: opts.signal,
    body: JSON.stringify({ model: opts.model, messages: opts.messages, userText: opts.userText }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(parseGeminiError(res.status, err));
  }

  const type = res.headers.get("content-type") || "";
  if (!type.includes("text/event-stream")) {
    const json = (await res.json()) as { text?: string };
    const text = json.text || "";
    if (text) opts.onDelta(text);
    return text;
  }

  if (!res.body) throw new Error("No response stream from the production agent.");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n");
    buffer = parts.pop() || "";
    for (const line of parts) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const text = (JSON.parse(data) as { text?: string }).text || "";
        if (text) {
          full += text;
          opts.onDelta(text);
        }
      } catch {
        /* Ignore incomplete SSE frames. */
      }
    }
  }

  return full;
}

async function generateGeminiOnce(opts: {
  model: ModelId;
  messages: ChatMessage[];
  userText: string;
  apiKey: string;
  signal?: AbortSignal;
}): Promise<string> {
  const contents = [
    ...opts.messages.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: opts.userText }] },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModelName(
    opts.model
  )}:generateContent?key=${encodeURIComponent(opts.apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: opts.signal,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(parseGeminiError(res.status, err));
  }

  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";
}

function parseGeminiError(status: number, body: string): string {
  try {
    const j = JSON.parse(body);
    const msg = j.error?.message || body;
    if (status === 400 && /API key/i.test(msg)) return "That Gemini API key looks invalid.";
    if (status === 429) return "Gemini is rate-limiting right now. Try again in a moment.";
    return msg;
  } catch {
    return `Gemini request failed (${status}).`;
  }
}
