import { useState } from "react";
import { APP_CONFIG } from "../lib/config";
import { scanGoogleWorkspace, type WorkspaceScan } from "../lib/googleWorkspace";
import { getPortalSummary } from "../lib/portal";
import { IconClose, IconCloud } from "./Icons";

type TokenClient = {
  requestAccessToken: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (options: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => TokenClient;
        };
      };
    };
  }
}

function loadGoogleIdentity() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google sign-in could not load."));
    document.head.appendChild(script);
  });
}

export function GoogleWorkspaceModal({ onClose }: { onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [scan, setScan] = useState<WorkspaceScan | null>(null);

  const connectAndScan = async () => {
    setError("");
    setBusy(true);
    try {
      const configuredClientId = APP_CONFIG.googleClientId || (await getPortalSummary()).googleClientId || "";
      if (!configuredClientId) throw new Error("Add a Google OAuth client ID in Admin or the public build before connecting Google Workspace.");
      await loadGoogleIdentity();
      const token = await new Promise<string>((resolve, reject) => {
        const request = window.google?.accounts?.oauth2?.initTokenClient({
            client_id: configuredClientId,
          scope: "https://www.googleapis.com/auth/drive.readonly",
          callback: (response) => (response.access_token ? resolve(response.access_token) : reject(new Error(response.error || "Google sign-in was cancelled."))),
        });
        if (!request) reject(new Error("Google sign-in is unavailable in this browser."));
        else request.requestAccessToken();
      });
      setScan(await scanGoogleWorkspace(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google Workspace scan failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-3 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-black/6 px-5 py-3.5">
          <div className="flex items-center gap-2 text-[15px] font-semibold">
            <IconCloud size={16} className="text-[#1473ff]" /> Google Workspace live scan
          </div>
          <button type="button" className="rounded-md p-1 text-neutral-500 hover:bg-black/5" onClick={onClose}>
            <IconClose size={14} />
          </button>
        </div>
        <div className="space-y-4 px-5 py-5">
          <p className="text-[13px] leading-relaxed text-neutral-600">
            Connect with read-only Google Drive permission to scan recent workspace files. The access token is used for this
            scan only and is not stored by VisaMOTion AI.
          </p>
          <button
            type="button"
            onClick={connectAndScan}
            disabled={busy}
            className="w-full rounded-xl bg-[#1473ff] px-4 py-2.5 text-[13px] font-medium text-white disabled:opacity-50"
          >
            {busy ? "Connecting and scanning..." : "Connect Google Workspace"}
          </button>
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-[12.5px] leading-relaxed text-red-700">{error}</p>}
          {scan && (
            <div className="rounded-xl border border-black/8 bg-[#f7f7f7] px-3 py-3">
              <div className="mb-2 flex items-center justify-between text-[12px] text-neutral-500">
                <span>{scan.files.length} recent files found</span>
                <span>{new Date(scan.scannedAt).toLocaleTimeString()}</span>
              </div>
              <div className="max-h-48 space-y-1 overflow-auto">
                {scan.files.map((file) => (
                  <a key={file.id} href={file.webViewLink || "#"} target="_blank" rel="noreferrer" className="block truncate rounded-lg px-2 py-1.5 text-[12.5px] text-neutral-700 hover:bg-white">
                    {file.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end border-t border-black/6 px-5 py-3">
          <button type="button" className="rounded-lg px-3 py-1.5 text-[13px] text-neutral-600 hover:bg-black/5" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
