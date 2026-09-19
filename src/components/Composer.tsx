import { useEffect, useRef, useState } from "react";
import { MODELS } from "../lib/gemini";
import type { ModelId } from "../types";
import { IconArrowUp, IconCloud, IconMic, IconPlus } from "./Icons";

const MODEL_KEY = "bionic.model";

export function getStoredModel(): ModelId {
  try {
    const v = localStorage.getItem(MODEL_KEY) as ModelId | null;
    if (v && MODELS.some((m) => m.id === v)) return v;
  } catch {
    /* ignore */
  }
  return "gemini-2.5-flash";
}

export function setStoredModel(id: ModelId) {
  localStorage.setItem(MODEL_KEY, id);
}

export function Composer({
  onSend,
  disabled,
  folderLabel,
  context,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  folderLabel: string;
  context: string;
}) {
  const [text, setText] = useState("");
  const [model, setModel] = useState<ModelId>(getStoredModel);
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setStoredModel(model);
  }, [model]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  const send = () => {
    const v = text.trim();
    if (!v || disabled) return;
    onSend(v);
    setText("");
    if (ta.current) ta.current.style.height = "auto";
  };

  const listen = () => {
    const w = window as unknown as {
      webkitSpeechRecognition?: new () => {
        lang: string;
        start: () => void;
        onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onend: (() => void) | null;
        onerror: (() => void) | null;
      };
    };
    const SR = w.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input is not available in this browser.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const said = Array.from(e.results as ArrayLike<ArrayLike<{ transcript: string }>>)
        .map((r) => r[0].transcript)
        .join(" ");
      setText((t) => (t ? `${t} ${said}` : said));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  };

  const current = MODELS.find((m) => m.id === model) || MODELS[0];

  return (
    <div className="px-4 pb-3 sm:px-8">
      <div className="mx-auto max-w-[560px]">
        <div className="rounded-[22px] border border-black/8 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
          <textarea
            ref={ta}
            value={text}
            disabled={disabled}
             placeholder="Ask Gemini Workspace to do something"
            rows={1}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            className="w-full resize-none bg-transparent px-4 pt-3.5 pb-1 text-[14.5px] leading-relaxed text-neutral-900 outline-none"
          />
          <div className="flex items-center gap-1 px-2.5 pb-2.5">
            <label className="cursor-pointer rounded-lg p-1.5 text-neutral-500 hover:bg-black/5">
              <IconPlus size={18} />
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setText((t) => (t ? `${t}\n\nAttached: ${f.name}` : `Please analyze ${f.name}`));
                }}
              />
            </label>
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((v) => !v);
                }}
                className="flex items-center gap-1 rounded-lg px-1.5 py-1 text-[12.5px] text-neutral-500 hover:bg-black/5"
              >
                <IconCloud size={14} />
                <span className="hidden sm:inline">{current.label}</span>
                <span className="text-neutral-400">▾</span>
              </button>
              {open && (
                <div
                  className="absolute right-0 bottom-9 z-20 w-56 overflow-hidden rounded-xl border border-black/8 bg-white py-1 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setModel(m.id);
                        setOpen(false);
                      }}
                      className={`flex w-full flex-col px-3 py-2 text-left hover:bg-black/4 ${m.id === model ? "bg-black/4" : ""}`}
                    >
                      <span className="text-[13px] font-medium text-neutral-900">{m.label}</span>
                      <span className="text-[11px] text-neutral-400">{m.hint}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={listen}
              className={`rounded-lg p-1.5 hover:bg-black/5 ${listening ? "text-[#1473ff]" : "text-neutral-500"}`}
              aria-label="Voice"
            >
              <IconMic size={16} />
            </button>
            <button
              type="button"
              onClick={send}
              disabled={disabled || !text.trim()}
              className="ml-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#5b8fff] text-white shadow-sm disabled:opacity-40"
              aria-label="Send"
            >
              <IconArrowUp size={15} />
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between px-1 text-[12px] text-neutral-400">
          <span className="capitalize">{folderLabel}</span>
          <span>Context: {context}</span>
        </div>
      </div>
    </div>
  );
}

