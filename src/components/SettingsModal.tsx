import { useState } from "react";
import { getApiKey, MODELS, setApiKey } from "../lib/gemini";
import { getStoredModel, setStoredModel } from "./Composer";
import type { ModelId } from "../types";
import { IconClose, IconKey } from "./Icons";
import { APP_CONFIG, isProductionApiConfigured } from "../lib/config";

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const [key, setKey] = useState(getApiKey);
  const [model, setModel] = useState<ModelId>(getStoredModel);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setApiKey(key);
    setStoredModel(model);
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-3 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/6 px-5 py-3.5">
          <h2 className="text-[15px] font-semibold">Settings</h2>
          <button type="button" className="rounded-md p-1 text-neutral-500 hover:bg-black/5" onClick={onClose}>
            <IconClose size={14} />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-[13px] font-medium text-neutral-800">
              <IconKey size={14} /> Gemini API key
            </div>
            <p className="mb-2 text-[12.5px] leading-relaxed text-neutral-500">
              For a production deployment, keep Gemini credentials on the server and set <code>VITE_API_BASE_URL</code> at
              build time. This optional key is only a local-browser fallback for previewing the workspace.
            </p>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIza…"
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-[13.5px] outline-none focus:border-[#1473ff]"
            />
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-block text-[12px] text-[#1473ff] hover:underline"
            >
              Get a key from Google AI Studio
            </a>
          </div>

          <div className="rounded-xl border border-black/8 bg-[#f7f7f7] px-3 py-3 text-[12px] text-neutral-600">
            <div className="mb-2 text-[13px] font-medium text-neutral-800">Production connections</div>
            <div className="flex items-center justify-between gap-3">
              <span>Agent API</span>
              <span className={isProductionApiConfigured() ? "text-emerald-600" : "text-amber-600"}>
                {isProductionApiConfigured() ? "Connected" : "Local fallback"}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <span>AWS Marketplace MCP</span>
              <span className="text-emerald-600">Ready on server</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <span>Browser Use MCP</span>
              <span className={APP_CONFIG.browserUseMcpUrl ? "text-emerald-600" : "text-amber-600"}>
                {APP_CONFIG.browserUseMcpUrl ? "Configured" : "Awaiting server URL"}
              </span>
            </div>
            <p className="mt-2 leading-relaxed text-neutral-400">
              AWS Marketplace uses its official public MCP endpoint. Browser automation stays disabled until a server-side
              Browser Use MCP endpoint is configured.
            </p>
          </div>

          <div>
            <div className="mb-1.5 text-[13px] font-medium text-neutral-800">Default model</div>
            <div className="grid gap-1.5">
              {MODELS.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 ${
                    model === m.id ? "border-[#1473ff] bg-[#1473ff]/6" : "border-black/8"
                  }`}
                >
                  <span>
                    <span className="block text-[13.5px] font-medium">{m.label}</span>
                    <span className="block text-[11.5px] text-neutral-400">{m.hint}</span>
                  </span>
                  <input
                    type="radio"
                    name="model"
                    checked={model === m.id}
                    onChange={() => setModel(m.id)}
                    className="accent-[#1473ff]"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-black/6 px-5 py-3">
          {saved && <span className="mr-auto text-[12.5px] text-emerald-600">Saved</span>}
          <button type="button" className="rounded-lg px-3 py-1.5 text-[13px] text-neutral-600 hover:bg-black/5" onClick={onClose}>
            Close
          </button>
          <button type="button" className="rounded-lg bg-[#1473ff] px-3.5 py-1.5 text-[13px] font-medium text-white" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
