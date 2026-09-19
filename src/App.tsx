import { useEffect, useMemo, useRef, useState } from "react";
import { ArtifactPanel } from "./components/ArtifactPanel";
import { ChatPanel } from "./components/ChatPanel";
import { getStoredModel } from "./components/Composer";
import { SettingsModal } from "./components/SettingsModal";
import { Sidebar } from "./components/Sidebar";
import { SEED_PROJECTS } from "./data/projects";
import { detectIntent, formatDuration, localAgentReply, wrapModelText } from "./lib/agent";
import { runBrowserWorkflow } from "./lib/browser";
import { APP_CONFIG } from "./lib/config";
import { getApiKey, MODELS, streamGemini } from "./lib/gemini";
import type { ChatMessage, Project } from "./types";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [activeId, setActiveId] = useState(SEED_PROJECTS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [elapsed, setElapsed] = useState("0s");
  const [draft, setDraft] = useState<ChatMessage | null>(null);
  const tick = useRef<number | null>(null);

  const project = useMemo(
    () => projects.find((p) => p.id === activeId) || projects[0],
    [projects, activeId]
  );

  const artifact = project.artifacts.find((a) => a.id === project.activeArtifactId) || project.artifacts[0] || null;

  useEffect(() => {
    setPreviewOpen(false);
    setSidebarOpen(false);
    setDraft(null);
  }, [activeId]);

  const patch = (id: string, fn: (p: Project) => Project) => {
    setProjects((all) => all.map((p) => (p.id === id ? fn(p) : p)));
  };

  const newProject = () => {
    const p: Project = {
      id: uid("proj"),
      title: "Untitled",
      folder: "general",
      messages: [],
      artifacts: [],
      contextTokens: "8.0K",
      createdAt: Date.now(),
    };
    setProjects((all) => [p, ...all]);
    setActiveId(p.id);
    setSidebarOpen(false);
  };

  const openFile = (artifactId: string) => {
    patch(project.id, (p) => ({ ...p, activeArtifactId: artifactId }));
    setPreviewOpen(true);
  };

  const send = async (text: string) => {
    if (working) return;
    const pid = project.id;
    const model = getStoredModel();
    const userMsg: ChatMessage = { id: uid("u"), role: "user", content: text, createdAt: Date.now() };
    const title = project.messages.length === 0 ? text.slice(0, 42) : project.title;
    const history = [...project.messages, userMsg];

    patch(pid, (p) => ({
      ...p,
      title,
      messages: [...p.messages, userMsg],
    }));

    const started = Date.now();
    setWorking(true);
    setElapsed("0s");
    tick.current = window.setInterval(() => setElapsed(formatDuration(Date.now() - started)), 250);

    const draftId = uid("a");
    const placeholder: ChatMessage = {
      id: draftId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      steps: [
        { title: "Reading the brief", detail: "Extracting the deliverable and constraints." },
        {
          title: detectIntent(text) === "browser" ? "Starting Browser Use workflow" : `Running ${MODELS.find((m) => m.id === model)?.label || model}`,
          detail: detectIntent(text) === "browser" ? "Navigating through the configured MCP browser with an approval gate." : "Working the request as an agent, not a chatbot.",
        },
      ],
    };
    setDraft(placeholder);

    try {
      const key = getApiKey();
      const intent = detectIntent(text);
      const useGemini = (Boolean(key) || Boolean(APP_CONFIG.apiBaseUrl)) && (model === "gemini-2.5-flash" || model === "gemini-2.5-pro");
      let resultText = "";

      if (intent === "browser" && APP_CONFIG.apiBaseUrl) {
        const browserResult = await runBrowserWorkflow(text);
        resultText = browserResult.liveUrl ? `${browserResult.text}\n\nLive browser view: ${browserResult.liveUrl}` : browserResult.text;
      } else if (useGemini) {
        resultText = await streamGemini({
          model,
          messages: history,
          userText: text,
          apiKey: key,
          onDelta: (chunk) => {
            setDraft((d) => (d ? { ...d, content: (d.content || "") + chunk } : d));
          },
        });
      }

      if (!resultText.trim()) {
        await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
      }

      const packed = resultText.trim() ? wrapModelText(resultText, text) : localAgentReply(text, model);
      const duration = formatDuration(Date.now() - started);
      const assistant: ChatMessage = {
        id: draftId,
        role: "assistant",
        content: packed.text,
        createdAt: Date.now(),
        durationLabel: duration,
        steps: packed.steps,
        files: packed.files,
      };

      patch(project.id, (p) => ({
        ...p,
        title: p.title === "Untitled" ? title : p.title,
        messages: [...p.messages.filter((m) => m.id !== draftId), assistant],
        artifacts: [...p.artifacts, ...packed.artifacts],
        activeArtifactId: packed.artifacts[0]?.id || p.activeArtifactId,
        contextTokens: `${(parseFloat(p.contextTokens) + 4.2).toFixed(1)}K`,
      }));
      setDraft(null);
      if (packed.artifacts[0]) setPreviewOpen(true);
    } catch (err) {
      const packed = localAgentReply(text, model);
      const duration = formatDuration(Date.now() - started);
      const note =
        err instanceof Error
          ? `\n\n_Live Gemini pass failed (${err.message}). Delivered with the studio agent instead._`
          : "";
      const assistant: ChatMessage = {
        id: draftId,
        role: "assistant",
        content: packed.text + note,
        createdAt: Date.now(),
        durationLabel: duration,
        steps: packed.steps,
        files: packed.files,
      };
      patch(pid, (p) => ({
        ...p,
        messages: [...p.messages, assistant],
        artifacts: [...p.artifacts, ...packed.artifacts],
        activeArtifactId: packed.artifacts[0]?.id || p.activeArtifactId,
      }));
      setDraft(null);
    } finally {
      if (tick.current) window.clearInterval(tick.current);
      setWorking(false);
    }
  };

  return (
    <div className="flex h-dvh items-stretch justify-center bg-[#cfcfcf] p-0 sm:p-3 lg:p-4">
      <div className="relative flex h-full w-full max-w-[1680px] overflow-hidden bg-white font-sans shadow-[0_20px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/10 sm:rounded-[12px]">
        <div className={`absolute inset-y-0 left-0 z-30 ${sidebarOpen ? "block" : "hidden"} lg:relative lg:block`}>
          <Sidebar
            projects={projects}
            activeId={activeId}
            onSelect={(id) => {
              setActiveId(id);
              setSidebarOpen(false);
            }}
            onNew={newProject}
            onSettings={() => setSettingsOpen(true)}
            onCloseMobile={() => setSidebarOpen(false)}
          />
        </div>
        {sidebarOpen && (
          <button
            type="button"
            className="absolute inset-0 z-20 bg-black/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        <div className="flex min-w-0 flex-1">
          <div className={`flex min-w-0 flex-1 ${previewOpen ? "hidden lg:flex" : "flex"}`}>
            <ChatPanel
              project={project}
              working={working}
              elapsed={elapsed}
              draftAssistant={draft}
              onSend={send}
              onOpenFile={openFile}
              onOpenSidebar={() => setSidebarOpen(true)}
              onOpenPreview={() => setPreviewOpen(true)}
            />
          </div>
          <div className={`${previewOpen ? "flex" : "hidden"} min-w-0 flex-[1.15] border-l border-black/8 lg:flex`}>
            <ArtifactPanel key={artifact?.id || "empty"} artifact={artifact} onClose={() => setPreviewOpen(false)} />
          </div>
        </div>
      </div>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
