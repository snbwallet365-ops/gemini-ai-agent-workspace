import { FOLDERS } from "../data/projects";
import type { Project } from "../types";
import { IconCompose, IconFolder, IconGear, IconLayout, IconPlus, IconSidebar } from "./Icons";
import { APP_CONFIG, isProductionApiConfigured } from "../lib/config";

export function Sidebar({
  projects,
  activeId,
  onSelect,
  onNew,
  onSettings,
  onCloseMobile,
}: {
  projects: Project[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onSettings: () => void;
  onCloseMobile?: () => void;
}) {
  return (
    <aside className="flex h-full w-[232px] shrink-0 flex-col bg-[#ececec] text-[13.5px] text-neutral-800">
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-1.5 pl-1">
          <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57] ring-1 ring-black/5" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e] ring-1 ring-black/5" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#28c840] ring-1 ring-black/5" />
        </div>
        <div className="flex items-center gap-1 text-neutral-500">
          <button
            type="button"
            className="rounded-md p-1.5 hover:bg-black/5"
            onClick={onCloseMobile}
            aria-label="Collapse sidebar"
          >
            <IconSidebar size={15} />
          </button>
          <button type="button" className="rounded-md p-1.5 hover:bg-black/5" onClick={onNew} aria-label="New project">
            <IconCompose size={15} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-3 pb-1 text-[11.5px] font-medium tracking-wide text-neutral-400">Projects</div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 scroll-thin">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-neutral-700 hover:bg-black/5"
        >
          <IconPlus size={14} />
          <span>New Project</span>
        </button>

        {FOLDERS.map((folder) => {
          const items = projects.filter((p) => p.folder === folder.id);
          return (
            <div key={folder.id} className="mt-1">
              <div className="flex items-center gap-2 px-2 py-1.5 text-neutral-700">
                {folder.icon === "layout" ? (
                  <IconLayout size={14} className="text-neutral-500" />
                ) : (
                  <IconFolder size={14} className="text-neutral-500" />
                )}
                <span>{folder.name}</span>
              </div>
              {items.map((p) => {
                const active = p.id === activeId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelect(p.id)}
                    className={`block w-full truncate rounded-lg py-1.5 pr-2 pl-8 text-left ${
                      active ? "bg-[#1473ff] font-medium text-white shadow-sm" : "text-neutral-700 hover:bg-black/5"
                    }`}
                  >
                    {p.title}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mx-2 mb-1 rounded-xl border border-black/6 bg-white/50 px-3 py-2 text-[11px] text-neutral-500">
        <div className="mb-1 font-medium text-neutral-700">Live connections</div>
        <div className="flex items-center justify-between">
          <span>Gemini agent</span>
          <span className={isProductionApiConfigured() ? "text-emerald-600" : "text-amber-600"}>
            {isProductionApiConfigured() ? "API" : "BYOK"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>AWS MCP</span>
          <span className={isProductionApiConfigured() ? "text-emerald-600" : "text-amber-600"}>
            {isProductionApiConfigured() ? "Connected" : "Server"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Browser Use</span>
          <span className={APP_CONFIG.browserUseMcpUrl ? "text-emerald-600" : "text-neutral-400"}>
            {APP_CONFIG.browserUseMcpUrl ? "Ready" : "Server"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSettings}
        className="m-2 flex items-center gap-2 rounded-lg px-2 py-2 text-neutral-700 hover:bg-black/5"
      >
        <IconGear size={15} />
        Settings
      </button>
    </aside>
  );
}
