import { apiUrl, APP_CONFIG } from "./config";

export type McpTool = {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
};

export async function listAwsMarketplaceTools(): Promise<McpTool[]> {
  if (!APP_CONFIG.apiBaseUrl) return [];
  const response = await fetch(apiUrl("/api/mcp/aws-marketplace"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method: "tools/list" }),
  });
  const body = (await response.json().catch(() => ({}))) as { result?: { tools?: McpTool[] }; error?: string };
  if (!response.ok) throw new Error(body.error || `AWS Marketplace MCP failed (${response.status}).`);
  return body.result?.tools || [];
}

export async function callAwsMarketplaceTool(name: string, args: Record<string, unknown>) {
  if (!APP_CONFIG.apiBaseUrl) throw new Error("Connect the production API before calling AWS Marketplace MCP.");
  const response = await fetch(apiUrl("/api/mcp/aws-marketplace"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method: "tools/call", name, arguments: args }),
  });
  const body = (await response.json().catch(() => ({}))) as { result?: unknown; error?: string };
  if (!response.ok) throw new Error(body.error || `AWS Marketplace MCP call failed (${response.status}).`);
  return body.result;
}
