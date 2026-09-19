import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env.PORT || 8787);
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
const geminiKey = process.env.GEMINI_API_KEY || "";
const awsMarketplaceUrl = process.env.AWS_MARKETPLACE_MCP_URL || "https://marketplace-mcp.us-east-1.api.aws/mcp";
const browserUseUrl = process.env.BROWSER_USE_MCP_URL || "";
const browserUseTool = process.env.BROWSER_USE_MCP_TOOL || "run_browser_agent";

const SYSTEM = `You are the production agent inside Gemini AI Agent Workspace. Work directly and carefully.
You can research, write, plan, analyze, and prepare structured artifacts. For visa-agency work, use official government sources,
separate facts from assumptions, never promise an approval or outcome, protect personal data, and require human review before
submission or payment. For browser workflows, explain what will be done and stop before irreversible actions unless the user
has explicitly approved that exact action.`;

function headers(extra = {}) {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type",
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
  if (!geminiKey) return sendJson(res, 503, { error: "GEMINI_API_KEY is not configured on the server." });
  const input = await body(req);
  const messages = Array.isArray(input.messages) ? input.messages.slice(-12) : [];
  const contents = [...messages, { role: "user", parts: [{ text: String(input.userText || "") }] }].map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content || message.parts?.[0]?.text || "" }],
  }));
  const model = input.model === "gemini-2.5-pro" ? "gemini-2.5-pro" : "gemini-2.5-flash";
  const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(geminiKey)}`, {
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
  if (!browserUseUrl) return sendJson(res, 503, { error: "Browser Use MCP is not configured on the server." });
  const input = await body(req);
  const task = String(input.task || "").trim();
  if (!task) return sendJson(res, 400, { error: "A browser task is required." });
  const response = await fetch(browserUseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", "MCP-Protocol-Version": "2025-06-18" },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method: "tools/call", params: { name: browserUseTool, arguments: { task } } }),
  });
  const text = await response.text();
  if (!response.ok) return sendJson(res, response.status, { error: text.slice(0, 500) });
  return sendJson(res, 200, { status: "completed", text: text || "Browser workflow completed." });
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
      return sendJson(res, 200, { ok: true, service: "gemini-ai-agent-workspace", capabilities: { gemini: Boolean(geminiKey), awsMarketplaceMcp: true, browserUseMcp: Boolean(browserUseUrl) } });
    }
    if (req.method === "POST" && req.url === "/api/agent/chat") return await handleGemini(req, res);
    if (req.method === "POST" && req.url === "/api/mcp/aws-marketplace") return await handleMcp(req, res);
    if (req.method === "POST" && req.url === "/api/browser/run") return await handleBrowser(req, res);
    return serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : "Unexpected server error." });
  }
});

server.listen(port, () => console.log(`Gemini AI Agent Workspace listening on ${port}`));
