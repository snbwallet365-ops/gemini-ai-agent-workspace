type PublicEnv = Record<string, string | undefined>;

const env = ((import.meta as ImportMeta & { env?: PublicEnv }).env || {}) as PublicEnv;

function read(name: string, fallback = "") {
  return (env[name] || fallback).trim();
}

export const APP_CONFIG = {
  apiBaseUrl: read("VITE_API_BASE_URL").replace(/\/$/, ""),
  awsMarketplaceMcpUrl: read(
    "VITE_AWS_MARKETPLACE_MCP_URL",
    "https://marketplace-mcp.us-east-1.api.aws/mcp"
  ),
  browserUseMcpUrl: read("VITE_BROWSER_USE_MCP_URL"),
  appName: read("VITE_APP_NAME", "Gemini AI Agent Workspace"),
};

export function apiUrl(path: string) {
  return `${APP_CONFIG.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isProductionApiConfigured() {
  return Boolean(APP_CONFIG.apiBaseUrl);
}
