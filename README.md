# VisaMOTion AI

A three-pane AI workspace for research, artifacts, visa-agency operations, and guarded browser workflows.

VisaMOTion AI includes persistent projects, live room presence, a read-only Google Drive scan, an installable PWA for mobile and desktop, structured visa dossiers, source URL requirements, printable PDF output, and Markdown document download.

## Run locally

```bash
npm install
cp .env.example .env
# Set GEMINI_API_KEY in .env for the server-side Gemini route.
npm run build
npm start
```

Open `http://localhost:8787`.

## Production configuration

- `GEMINI_API_KEY` stays server-side and is never bundled into the browser.
- `BROWSER_USE_MCP_URL` points to the deployed Browser Use MCP server. `BROWSER_USE_MCP_TOOL` selects its browser-agent tool.
- `AWS_MARKETPLACE_MCP_URL` defaults to the official AWS Marketplace MCP endpoint and is proxied through `/api/mcp/aws-marketplace`.
- `VITE_GOOGLE_CLIENT_ID` enables the sidebar's read-only Google Workspace scan. The user grants Drive read access in the browser; access tokens are not stored.
- `ALLOWED_ORIGIN` should be set to the exact public app origin instead of `*` for a locked-down deployment.
- `VITE_API_BASE_URL` is the public URL of this server when the UI and API are deployed separately.

`render.yaml` is included for a Node web service deployment. The service exposes `/api/health`, streams the configured AI provider, proxies the allow-listed AWS Marketplace MCP tools, supports live visa research through Browser Use MCP, scans Google Drive with a temporary token, and keeps browser automation behind the server.

## Safety boundary

Visa workflows are source-first and do not promise approval. Browser workflows may navigate and prepare drafts, but the agent must pause before payments, sensitive uploads, declarations, or final submission.

See `packaging/README.md` for the Android APK wrapper path and Windows PWA / desktop packaging path.
