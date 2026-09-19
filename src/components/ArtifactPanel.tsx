import { useEffect, useMemo, useState } from "react";
import type { Artifact } from "../types";
import {
  IconChevron,
  IconChevronLeft,
  IconClose,
  IconDocTab,
  IconDownload,
  IconExpand,
  IconMinus,
  IconPlus,
  IconSearch,
} from "./Icons";
import { MarkdownDoc } from "./MarkdownDoc";
import { PlantPdfPage } from "./PlantPdfPage";

export function ArtifactPanel({
  artifact,
  onClose,
}: {
  artifact: Artifact | null;
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(86);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const total = artifact?.pages?.length || 1;
  const safePage = Math.min(page, total - 1);

  const filteredMarkdown = useMemo(() => {
    if (!artifact?.markdown) return "";
    if (!query.trim()) return artifact.markdown;
    const q = query.trim().toLowerCase();
    return artifact.markdown
      .split("\n")
      .filter((line) => line.toLowerCase().includes(q))
      .join("\n");
  }, [artifact, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage((p) => Math.min(total - 1, p + 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(0, p - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  if (!artifact) {
    return (
      <section className="hidden h-full min-w-0 flex-1 flex-col border-l border-black/8 bg-white lg:flex">
        <div className="flex h-12 items-center justify-between border-b border-black/6 px-3">
          <div className="text-[13px] text-neutral-400">No file open</div>
        </div>
        <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
          Artifacts you create will open here.
        </div>
      </section>
    );
  }

  const bump = (d: number) => setPage((p) => Math.max(0, Math.min(total - 1, p + d)));

  const download = () => {
    const value = artifact.imageSvg || artifact.markdown || artifact.pages?.map((p) => `${p.name} (${p.latin})\n${p.about}\n`).join("\n\n") || artifact.title;
    const blob = new Blob([value], { type: artifact.imageSvg ? "image/svg+xml" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = artifact.imageSvg ? artifact.fileName : artifact.markdown ? artifact.fileName.replace(/\.pdf$/i, ".md") : artifact.fileName.replace(/\.pdf$/i, ".txt");
     a.click();
     URL.revokeObjectURL(url);
  };

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col bg-white">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-black/6 px-2 sm:px-3">
        <div className="flex min-w-0 items-center gap-2 rounded-full bg-[#f2f2f2] px-2.5 py-1 text-[13px] text-neutral-700">
          <IconDocTab size={13} className="text-neutral-500" />
          <span className="truncate font-medium">{artifact.fileName}</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" className="rounded-md px-2 py-1 text-[12px] text-neutral-500 hover:bg-black/5 lg:hidden" onClick={onClose}>
            Chat
          </button>
          <button type="button" className="rounded-md p-1.5 text-neutral-500 hover:bg-black/5" onClick={onClose} aria-label="Close preview">
            <IconClose size={14} />
          </button>
        </div>
      </div>

      <div className="flex h-11 shrink-0 items-center gap-1 border-b border-black/6 px-2 text-neutral-600 sm:px-3">
        <button type="button" className="rounded p-1 hover:bg-black/5 disabled:opacity-30" disabled={safePage === 0} onClick={() => bump(-1)}>
          <IconChevronLeft size={14} />
        </button>
        <div className="flex items-center gap-1 text-[12.5px]">
          <input
            value={safePage + 1}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) setPage(Math.max(0, Math.min(total - 1, n - 1)));
            }}
            className="h-7 w-8 rounded-md border border-black/10 bg-white text-center text-[12.5px] outline-none"
          />
          <span className="text-neutral-400">of {total}</span>
        </div>
        <button type="button" className="rounded p-1 hover:bg-black/5 disabled:opacity-30" disabled={safePage >= total - 1} onClick={() => bump(1)}>
          <IconChevron size={14} />
        </button>

        <div className="mx-2 hidden h-4 w-px bg-black/10 sm:block" />

        <button type="button" className="rounded p-1 hover:bg-black/5" onClick={() => setShowSearch((s) => !s)} aria-label="Search">
          <IconSearch size={14} />
        </button>
        <span className="min-w-[40px] text-center text-[12.5px]">{zoom}%</span>
        <button type="button" className="rounded p-1 hover:bg-black/5" onClick={() => setZoom((z) => Math.max(60, z - 8))} aria-label="Zoom out">
          <IconMinus size={13} />
        </button>
        <button type="button" className="rounded p-1 hover:bg-black/5" onClick={() => setZoom((z) => Math.min(140, z + 8))} aria-label="Zoom in">
          <IconPlus size={13} />
        </button>
        <button
          type="button"
          className="rounded p-1 hover:bg-black/5"
          onClick={() => setZoom((z) => (z === 86 ? 110 : 86))}
          aria-label="Fit"
        >
          <IconExpand size={13} />
        </button>
         <button type="button" className="ml-auto rounded p-1 hover:bg-black/5" onClick={download} aria-label="Download source">
           <IconDownload size={14} />
         </button>
         <button type="button" className="rounded px-2 py-1 text-[11px] text-neutral-500 hover:bg-black/5" onClick={() => window.print()}>
           PDF
         </button>
      </div>

      {showSearch && (
        <div className="flex items-center gap-2 border-b border-black/6 px-3 py-2">
          <IconSearch size={13} className="text-neutral-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find in document"
            className="w-full bg-transparent text-[13px] outline-none"
          />
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto bg-[#f6f6f6] scroll-thin">
        <div
          id="print-artifact"
          className="mx-auto origin-top py-4 transition-transform"
          style={{
            width: artifact.kind === "pdf" ? `${Math.max(320, (760 * zoom) / 100)}px` : `${Math.max(320, (680 * zoom) / 100)}px`,
          }}
        >
           {artifact.kind === "image" && artifact.imageSvg ? (
             <div className="overflow-hidden rounded-sm bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5" dangerouslySetInnerHTML={{ __html: artifact.imageSvg }} />
           ) : artifact.kind === "pdf" && artifact.pages ? (
            <div className="overflow-hidden rounded-sm bg-[#f4f1e8] shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
              <div style={{ zoom: 1 }}>
                <PlantPdfPage page={artifact.pages[safePage]} index={safePage} total={total} />
              </div>
            </div>
          ) : (
            <div className="min-h-[720px] rounded-sm bg-[#f4f1e8] px-8 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 sm:px-12">
              <p className="mb-6 text-[10px] font-medium tracking-[0.14em] text-[#9a9588] uppercase">
                VisaMOTion AI · {artifact.kind} · {artifact.fileName}
              </p>
              <MarkdownDoc markdown={filteredMarkdown || `# ${artifact.title}\n\nNo content.`} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
