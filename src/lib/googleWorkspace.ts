import { apiUrl, APP_CONFIG } from "./config";

export type WorkspaceFile = {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
};

export type WorkspaceScan = {
  provider: "Google Drive";
  scannedAt: string;
  files: WorkspaceFile[];
};

const DRIVE_FIELDS = "files(id,name,mimeType,modifiedTime,webViewLink)";

export async function scanGoogleWorkspace(accessToken: string): Promise<WorkspaceScan> {
  const response = APP_CONFIG.apiBaseUrl
    ? await fetch(apiUrl("/api/google/workspace/scan"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      })
    : await fetch(`https://www.googleapis.com/drive/v3/files?pageSize=25&orderBy=modifiedTime%20desc&fields=${encodeURIComponent(DRIVE_FIELDS)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

  const body = (await response.json().catch(() => ({}))) as WorkspaceScan & { error?: string };
  if (!response.ok) throw new Error(body.error || `Google Workspace scan failed (${response.status}).`);
  return body;
}
