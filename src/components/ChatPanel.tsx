import { useEffect, useRef, useState } from "react";
import type { ChatMessage, Project } from "../types";
import { Composer } from "./Composer";
import { IconChevron, IconCopy, IconDots, IconMenu, IconPdf, IconShareBox, IconShareNodes } from "./Icons";

function FileCard({
  name,
  kind,
  onOpen,
}: {
  name: string;
  kind: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full max-w-[420px] items-center gap-3 rounded-2xl border border-black/6 bg-[#f7f7f7] px-3 py-2.5 text-left hover:bg-[#f2f2f2]"
    >
      <IconPdf size={34} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] text-neutral-900">{name}</span>
        <span className="block text-[11.5px] tracking-wide text-neutral-400 uppercase">{kind}</span>
      </span>
      <span className="p-1 text-neutral-400">
        <IconDots size={16} />
      </span>
    </button>
  );
}

function MessageBody({ text }: { text: string }) {
  const paras = text.split(/\n\n+/);
  return (
    <div className="space-y-3 text-[14.5px] leading-[1.65] text-neutral-800">
      {paras.map((p, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {p.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") ? (
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </p>
      ))}
    </div>
  );
}

function AssistantBlock({
  message,
  working,
  elapsed,
  onOpenFile,
}: {
  message: ChatMessage;
  working?: boolean;
  elapsed?: string;
  onOpenFile: (artifactId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = working ? `Working for ${elapsed || "0s"}` : message.durationLabel ? `Worked for ${message.durationLabel}` : "Worked";

  return (
    <div className="animate-fade-up">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-[13.5px] text-neutral-400 hover:text-neutral-600"
      >
        {working && (
          <span className="mr-1 inline-flex gap-0.5">
            <span className="working-dot h-1.5 w-1.5 rounded-full bg-neutral-400" />
            <span className="working-dot h-1.5 w-1.5 rounded-full bg-neutral-400" style={{ animationDelay: "0.15s" }} />
            <span className="working-dot h-1.5 w-1.5 rounded-full bg-neutral-400" style={{ animationDelay: "0.3s" }} />
          </span>
        )}
        {label}
        <IconChevron size={12} className={`transition ${open ? "rotate-90" : ""}`} />
      </button>

      {open && message.steps && (
        <ol className="mt-3 space-y-2 border-l border-black/10 pl-4">
          {message.steps.map((s, i) => (
            <li key={i} className="text-[13px]">
              <div className="font-medium text-neutral-800">{s.title}</div>
              <div className="text-neutral-500">{s.detail}</div>
            </li>
          ))}
        </ol>
      )}

      {message.content && (
        <div className="mt-4">
          <MessageBody text={message.content} />
        </div>
      )}

      {message.files && message.files.length > 0 && (
        <div className="mt-5 space-y-2">
          {message.files.map((f) => (
            <FileCard key={f.id} name={f.name} kind={f.kind} onOpen={() => onOpenFile(f.artifactId)} />
          ))}
        </div>
      )}

      {!working && (
        <div className="mt-3 flex items-center gap-1 text-neutral-400">
          <button
            type="button"
            className="rounded-md p-1.5 hover:bg-black/5 hover:text-neutral-700"
            onClick={() => navigator.clipboard.writeText(message.content)}
            aria-label="Copy"
          >
            <IconCopy size={14} />
          </button>
          <button
            type="button"
            className="rounded-md p-1.5 hover:bg-black/5 hover:text-neutral-700"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            aria-label="Share"
          >
            <IconShareNodes size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export function ChatPanel({
  project,
  working,
  elapsed,
  draftAssistant,
  onSend,
  onOpenFile,
  onOpenSidebar,
  onOpenPreview,
}: {
  project: Project;
  working: boolean;
  elapsed: string;
  draftAssistant?: ChatMessage | null;
  onSend: (text: string) => void;
  onOpenFile: (artifactId: string) => void;
  onOpenSidebar: () => void;
  onOpenPreview: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const messages = draftAssistant ? [...project.messages, draftAssistant] : project.messages;

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, draftAssistant?.content, working]);

  const empty = messages.length === 0;

  const folderLabel =
    project.folder === "general"
      ? "General"
      : project.folder === "creative"
        ? "Creative Projects"
        : project.folder === "personal"
          ? "Personal website"
          : "Visa Agency";

  return (
    <section className="flex h-full min-w-0 flex-[0.92] flex-col bg-white">
      <header className="flex h-12 shrink-0 items-center gap-2 px-3">
        <button type="button" className="rounded-md p-1.5 text-neutral-600 hover:bg-black/5 lg:hidden" onClick={onOpenSidebar}>
          <IconMenu size={16} />
        </button>
        <span className="text-neutral-500">
          <IconShareBox size={15} />
        </span>
        <h1 className="truncate text-[14.5px] font-medium text-neutral-900">{project.title}</h1>
        {project.activeArtifactId && (
          <button
            type="button"
            className="ml-auto rounded-md px-2 py-1 text-[12px] text-neutral-500 hover:bg-black/5 lg:hidden"
            onClick={onOpenPreview}
          >
            Preview
          </button>
        )}
      </header>

      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-10 scroll-thin">
        <div className="mx-auto max-w-[540px]">
          {empty && (
            <div className="pt-16 text-center">
              <p className="text-[15px] text-neutral-400">Ask VisaMOTion AI to research, write, or make a file.</p>
            </div>
          )}
          {messages.map((m, idx) => {
            const isLast = idx === messages.length - 1;
            if (m.role === "user") {
              return (
                <div key={m.id} className="mb-8">
                  <div className="rounded-2xl bg-[#f3f3f3] px-4 py-3.5 text-[14.5px] leading-relaxed text-neutral-800">
                    {m.content}
                  </div>
                </div>
              );
            }
            return (
              <div key={m.id} className="mb-10">
                <AssistantBlock
                  message={m}
                  working={working && isLast}
                  elapsed={elapsed}
                  onOpenFile={onOpenFile}
                />
              </div>
            );
          })}
        </div>
      </div>

      <Composer onSend={onSend} disabled={working} folderLabel={folderLabel} context={project.contextTokens} />
    </section>
  );
}
