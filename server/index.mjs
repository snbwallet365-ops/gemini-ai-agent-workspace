import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env.PORT || 8787);
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
const awsMarketplaceUrl = process.env.AWS_MARKETPLACE_MCP_URL || "https://marketplace-mcp.us-east-1.api.aws/mcp";
const browserUseTool = process.env.BROWSER_USE_MCP_TOOL || "run_browser_agent";
const runtimeSecrets = {
  primaryAiKey: process.env.GEMINI_API_KEY || "",
  exaApiKey: process.env.EXA_API_KEY || "",
  browserUseApiKey: process.env.BROWSER_USE_API_KEY || "",
  browserUseUrl: process.env.BROWSER_USE_MCP_URL || "",
  whatsappToken: process.env.WHATSAPP_CLOUD_TOKEN || "",
  whatsappPhoneId: process.env.WHATSAPP_PHONE_ID || "",
};
const runtimeSettings = { clientPin: process.env.CLIENT_ACCESS_PIN || "666085", adminPin: process.env.ADMIN_MASTER_PIN || "132313", notice: "" };
const sessions = new Map();

const SYSTEM = `You are the production agent inside VisaMOTion AI. Work directly and carefully.
You can research, write, plan, analyze, and prepare structured artifacts. For visa-agency work, use official government sources,
embassies, consulates, official missions, and authorized VACs. Never invent a fee, processing window, photo dimension, eligibility
rule, or document requirement from memory. Include the exact source URL beside every volatile claim and mark missing live data as
LIVE VERIFICATION REQUIRED. Return the Visa Dossier structure: profile, official authority, source URL, key parameters, mandatory
documents, supporting and financial evidence, travel logistics, fee table, operational notes, and the policy-volatility advisory.
Separate facts from assumptions, never promise an approval or outcome, protect personal data, and require human review before
submission or payment. For browser workflows, explain what will be done and stop before irreversible actions unless the user
has explicitly approved that exact action.`;

function headers(extra = {}) {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    ...extra,
  };
}

function sendJson(res, status, payload) {
  res.writeHead(status, headers({ "Content-Type": "application/json; charset=utf-8" }));
  res.end(JSON.stringify(payload));
}

async function body(req) {
  let value = "";
  for await (const chunk of req) value += chunk;
  return value ? JSON.parse(value) : {};
}

function sessionFor(req, role) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now() || session.role !== role) return null;
  return session;
}

function requireSession(req, res, role) {
  if (sessionFor(req, role)) return true;
  sendJson(res, 401, { error: "Admin authentication is required." });
  return false;
}

async function handleLogin(req, res) {
  const input = await body(req);
  const role = input.role === "admin" ? "admin" : "client";
  const pin = String(input.pin || "");
  const expected = role === "admin" ? runtimeSettings.adminPin : runtimeSettings.clientPin;
  if (!pin || pin !== expected) return sendJson(res, 401, { error: "That access code is not correct." });
  const token = randomUUID();
  sessions.set(token, { role, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
  return sendJson(res, 200, { token, role });
}

function configuredStatus() {
  return {
    ai: Boolean(runtimeSecrets.primaryAiKey),
    exa: Boolean(runtimeSecrets.exaApiKey),
    browser: Boolean(runtimeSecrets.browserUseApiKey || runtimeSecrets.browserUseUrl),
    whatsapp: Boolean(runtimeSecrets.whatsappToken && runtimeSecrets.whatsappPhoneId),
  };
}

async function handleAdminOverview(req, res) {
  if (!requireSession(req, res, "admin")) return;
  let activeClients = 0;
  for (const [token, session] of sessions) {
    if (session.expiresAt < Date.now()) sessions.delete(token);
    else if (session.role === "client") activeClients += 1;
  }
  return sendJson(res, 200, { activeClients, configured: configuredStatus(), notice: runtimeSettings.notice });
}

async function handleAdminConfig(req, res) {
  if (!requireSession(req, res, "admin")) return;
  const input = await body(req);
  for (const key of Object.keys(runtimeSecrets)) {
    if (typeof input[key] === "string" && input[key].trim()) runtimeSecrets[key] = input[key].trim();
  }
  return sendJson(res, 200, { stored: "server-memory", configured: configuredStatus() });
}

async function handleAdminClientPin(req, res) {
  if (!requireSession(req, res, "admin")) return;
  runtimeSettings.clientPin = String(Math.floor(100000 + Math.random() * 900000));
  return sendJson(res, 200, { pin: runtimeSettings.clientPin });
}

async function handleAdminNotice(req, res) {
  if (!requireSession(req, res, "admin")) return;
  const input = await body(req);
  runtimeSettings.notice = String(input.notice || "").slice(0, 1000);
  return sendJson(res, 200, { saved: true });
}

async function mcpRequest(method, params = {}) {
  const id = Date.now();
  const baseHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    "MCP-Protocol-Version": "2025-06-18",
  };
  const init = await fetch(awsMarketplaceUrl, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ jsonrpc: "2.0", id, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "gemini-ai-agent-workspace", version: "1.0.0" } } }),
  });
  const sessionId = init.headers.get("mcp-session-id") || init.headers.get("Mcp-Session-Id");
  const requestHeaders = sessionId ? { ...baseHeaders, "Mcp-Session-Id": sessionId } : baseHeaders;
  const response = await fetch(awsMarketplaceUrl, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({ jsonrpc: "2.0", id: id + 1, method, params }),
  });
  const text = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { error: { message: text || `MCP request failed (${response.status})` } };
  }
  if (!response.ok) throw new Error(parsed.error?.message || `MCP request failed (${response.status})`);
  return parsed;
}

async function handleMcp(req, res) {
  const input = await body(req);
  if (input.method === "tools/list") return sendJson(res, 200, await mcpRequest("tools/list"));
  if (input.method === "tools/call") {
    const name = String(input.name || "");
    if (!/^((get|search|research|submit)_aws_marketplace_)/.test(name)) {
      return sendJson(res, 400, { error: "Tool is not allow-listed for this workspace." });
    }
    return sendJson(res, 200, await mcpRequest("tools/call", { name, arguments: input.arguments || {} }));
  }
  return sendJson(res, 400, { error: "Supported MCP methods are tools/list and tools/call." });
}

async function handleGemini(req, res) {
  if (!runtimeSecrets.primaryAiKey) return sendJson(res, 503, { error: "The primary AI key is not configured on the server." });
  const input = await body(req);
  const messages = Array.isArray(input.messages) ? input.messages.slice(-12) : [];
  const contents = [...messages, { role: "user", parts: [{ text: String(input.userText || "") }] }].map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content || message.parts?.[0]?.text || "" }],
  }));
  const model = input.model === "gemini-2.5-pro" ? "gemini-2.5-pro" : "gemini-2.5-flash";
  const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(runtimeSecrets.primaryAiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents, generationConfig: { temperature: 0.7, maxOutputTokens: 4096 } }),
  });
  if (!upstream.ok) return sendJson(res, upstream.status, { error: (await upstream.text()).slice(0, 500) });
  res.writeHead(200, headers({ "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache", Connection: "keep-alive" }));
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.trim().startsWith("data:")) continue;
      try {
        const chunk = JSON.parse(line.trim().slice(5));
        const text = chunk.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
        if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
      } catch {
        // Ignore keep-alive and incomplete upstream frames.
      }
    }
  }
  res.write("data: [DONE]\n\n");
  res.end();
}

async function handleBrowser(req, res) {
  if (!runtimeSecrets.browserUseUrl) return sendJson(res, 503, { error: "Browser Use MCP is not configured on the server." });
  const input = await body(req);
  const task = String(input.task || "").trim();
  if (!task) return sendJson(res, 400, { error: "A browser task is required." });
  const response = await fetch(runtimeSecrets.browserUseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", "MCP-Protocol-Version": "2025-06-18" },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method: "tools/call", params: { name: browserUseTool, arguments: { task } } }),
  });
  const text = await response.text();
  if (!response.ok) return sendJson(res, response.status, { error: text.slice(0, 500) });
  return sendJson(res, 200, { status: "completed", text: text || "Browser workflow completed." });
}

async function handleVisaResearch(req, res) {
  if (!runtimeSecrets.browserUseUrl) return sendJson(res, 503, { error: "Live visa verification needs a configured Browser Use MCP server." });
  const input = await body(req);
  const task = String(input.task || "").trim();
  if (!task) return sendJson(res, 400, { error: "A visa research brief is required." });
  const guardedTask = `You are the live research worker for VisaMOTion AI. Research only current official immigration authorities, embassy or consulate portals, official missions, and authorized VAC sites such as VFS Global, TLScontact, or BLS International. Never use memory to invent fees, processing windows, photo dimensions, eligibility, or document rules. Return a structured visa dossier with the exact source URL beside each volatile claim, clearly separate mandatory documents from supporting evidence, show fee calculations, and end with this exact advisory: Consular authorities hold sole discretionary authority over visa issuance, interviews, and supplemental-document requests. Consular fees, visa requirements, and processing durations may change without prior notice. Stop before any login, upload, payment, declaration, or submission. User brief: ${task}`;
  const response = await fetch(runtimeSecrets.browserUseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", "MCP-Protocol-Version": "2025-06-18" },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method: "tools/call", params: { name: browserUseTool, arguments: { task: guardedTask } } }),
  });
  const text = await response.text();
  if (!response.ok) return sendJson(res, response.status, { error: text.slice(0, 500) });
  return sendJson(res, 200, { status: "verified", text: text || "No verified visa research was returned." });
}

async function handleExaSearch(req, res) {
  if (!runtimeSecrets.exaApiKey) return sendJson(res, 503, { error: "Exa search is not configured on the server." });
  const input = await body(req);
  const query = String(input.query || "").trim();
  if (!query) return sendJson(res, 400, { error: "A search query is required." });
  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": runtimeSecrets.exaApiKey },
    body: JSON.stringify({ query, type: "auto", numResults: Math.min(Number(input.numResults || 8), 20), contents: { highlights: { maxCharacters: 1200 } } }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return sendJson(res, response.status, { error: result.error || "Exa search failed." });
  return sendJson(res, 200, result);
}

async function handleWhatsAppAlert(req, res) {
  if (!runtimeSecrets.whatsappToken || !runtimeSecrets.whatsappPhoneId) return sendJson(res, 503, { error: "WhatsApp Cloud API is not configured on the server." });
  const input = await body(req);
  const to = String(input.to || "").trim();
  if (!to) return sendJson(res, 400, { error: "A WhatsApp recipient is required." });
  const response = await fetch(`https://graph.facebook.com/v20.0/${encodeURIComponent(runtimeSecrets.whatsappPhoneId)}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${runtimeSecrets.whatsappToken}` },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "template", template: { name: String(input.template || "visa_slot_alert"), language: { code: String(input.language || "en_US") }, components: Array.isArray(input.components) ? input.components : [] } }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return sendJson(res, response.status, { error: result.error?.message || "WhatsApp message failed." });
  return sendJson(res, 200, result);
}

async function handleGoogleWorkspace(req, res) {
  const input = await body(req);
  const accessToken = String(input.accessToken || "").trim();
  if (!accessToken) return sendJson(res, 401, { error: "A temporary Google Workspace access token is required." });
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.set("pageSize", "25");
  url.searchParams.set("orderBy", "modifiedTime desc");
  url.searchParams.set("fields", "files(id,name,mimeType,modifiedTime,webViewLink)");
  const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return sendJson(res, response.status, { error: result.error?.message || "Google Drive scan failed." });
  return sendJson(res, 200, { provider: "Google Drive", scannedAt: new Date().toISOString(), files: result.files || [] });
}

const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json" };

async function serveStatic(req, res) {
  const raw = new URL(req.url, "http://localhost").pathname;
  const requested = raw === "/" ? "/dist/index.html" : `/dist${normalize(raw)}`;
  const filePath = join(root, requested);
  try {
    await access(filePath);
    res.writeHead(200, headers({ "Content-Type": mime[extname(filePath)] || "application/octet-stream" }));
    createReadStream(filePath).pipe(res);
  } catch {
    const fallback = await readFile(join(root, "dist/index.html"));
    res.writeHead(200, headers({ "Content-Type": "text/html; charset=utf-8" }));
    res.end(fallback);
  }
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") return sendJson(res, 204, {});
    if (req.method === "GET" && req.url === "/api/health") {
      return sendJson(res, 200, { ok: true, service: "visamotion-ai", capabilities: { ai: Boolean(runtimeSecrets.primaryAiKey), awsMarketplaceMcp: true, browserUseMcp: Boolean(runtimeSecrets.browserUseUrl), googleWorkspace: true } });
    }
    if (req.method === "POST" && req.url === "/api/auth/login") return await handleLogin(req, res);
    if (req.method === "GET" && req.url === "/api/admin/overview") return await handleAdminOverview(req, res);
    if (req.method === "POST" && req.url === "/api/admin/config") return await handleAdminConfig(req, res);
    if (req.method === "POST" && req.url === "/api/admin/client-pin") return await handleAdminClientPin(req, res);
    if (req.method === "POST" && req.url === "/api/admin/notice") return await handleAdminNotice(req, res);
    if (req.method === "POST" && req.url === "/api/agent/chat") return await handleGemini(req, res);
    if (req.method === "POST" && req.url === "/api/mcp/aws-marketplace") return await handleMcp(req, res);
    if (req.method === "POST" && req.url === "/api/browser/run") return await handleBrowser(req, res);
    if (req.method === "POST" && req.url === "/api/visa/research") return await handleVisaResearch(req, res);
    if (req.method === "POST" && req.url === "/api/search/exa") return await handleExaSearch(req, res);
    if (req.method === "POST" && req.url === "/api/notifications/whatsapp") return await handleWhatsAppAlert(req, res);
    if (req.method === "POST" && req.url === "/api/google/workspace/scan") return await handleGoogleWorkspace(req, res);
    return serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : "Unexpected server error." });
  }
});

server.listen(port, () => console.log(`Gemini AI Agent Workspace listening on ${port}`));
