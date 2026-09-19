import { useEffect, useMemo, useRef, useState } from "react";
import { ArtifactPanel } from "./components/ArtifactPanel";
import { AccessGate } from "./components/AccessGate";
import { AdminConsole } from "./components/AdminConsole";
import { ChatPanel } from "./components/ChatPanel";
import { ChecklistModal } from "./components/ChecklistModal";
import { ClientStudioModal } from "./components/ClientStudioModal";
import { getStoredModel } from "./components/Composer";
import { GoogleWorkspaceModal } from "./components/GoogleWorkspaceModal";
import { SettingsModal } from "./components/SettingsModal";
import { Sidebar } from "./components/Sidebar";
import { SEED_PROJECTS } from "./data/projects";
import { detectIntent, formatDuration, localAgentReply, wrapModelText } from "./lib/agent";
import { runBrowserWorkflow } from "./lib/browser";
import { APP_CONFIG } from "./lib/config";
import { getApiKey, MODELS, streamGemini } from "./lib/gemini";
import { connectRealtime, type RealtimeStatus } from "./lib/realtime";
import { clearSession, hasStoredSession, type AccessRole } from "./lib/auth";
import { runVisaResearch } from "./lib/visaResearch";
import type { ChatMessage, Project } from "./types";

const PROJECTS_KEY = "visamotion.projects.v1";
const ACTIVE_PROJECT_KEY = "visamotion.activeProject";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function loadProjects() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROJECTS_KEY) || "null") as Project[] | null;
    if (Array.isArray(saved) && saved.length > 0) return saved;
  } catch {
    /* Use the seed workspace when local storage is unavailable. */
  }
  return SEED_PROJECTS;
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function WorkspaceApp() {
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [activeId, setActiveId] = useState(() => localStorage.getItem(ACTIVE_PROJECT_KEY) || SEED_PROJECTS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [workspaceScanOpen, setWorkspaceScanOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [installNotice, setInstallNotice] = useState("");
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>("connecting");
  const [working, setWorking] = useState(false);
  const [elapsed, setElapsed] = useState("0s");
  const [draft, setDraft] = useState<ChatMessage | null>(null);
  const tick = useRef<number | null>(null);
  const installPrompt = useRef<InstallPromptEvent | null>(null);
  const realtime = useRef<ReturnType<typeof connectRealtime> | null>(null);
  const projectsRef = useRef(projects);
  projectsRef.current = projects;

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

  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      localStorage.setItem(ACTIVE_PROJECT_KEY, activeId);
    } catch {
      /* Persistence is best-effort for private browsing. */
    }
  }, [projects, activeId]);

  useEffect(() => {
    realtime.current = connectRealtime({
      room: "visamotion-ai",
      onStatus: setRealtimeStatus,
      onEvent: (event) => {
        if (event.kind === "active-project" && event.projectId && projectsRef.current.some((item) => item.id === event.projectId)) {
          setActiveId(event.projectId);
        }
      },
    });
    return () => realtime.current?.close();
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    const captureInstall = (event: Event) => {
      event.preventDefault();
      installPrompt.current = event as InstallPromptEvent;
      setInstallAvailable(true);
    };
    window.addEventListener("beforeinstallprompt", captureInstall);
    return () => window.removeEventListener("beforeinstallprompt", captureInstall);
  }, []);

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
    realtime.current?.send({ kind: "active-project", projectId: p.id, at: Date.now() });
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
    const intent = detectIntent(text);
    realtime.current?.send({ kind: "agent-request", projectId: pid, text, at: Date.now() });

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
          title:
            intent === "visa"
              ? "Verifying official visa sources"
              : intent === "browser"
                ? "Starting Browser Use workflow"
                : `Running ${MODELS.find((m) => m.id === model)?.label || model}`,
          detail:
            intent === "visa"
              ? "Checking official immigration, embassy, consulate, and authorized VAC sources before drafting the dossier."
              : intent === "browser"
                ? "Navigating through the configured MCP browser with an approval gate."
                : "Working the request as an agent, not a chatbot.",
        },
      ],
    };
    setDraft(placeholder);

    try {
      const key = getApiKey();
       const useGemini = (Boolean(key) || Boolean(APP_CONFIG.apiBaseUrl)) && (model === "gemini-2.5-flash" || model === "gemini-2.5-pro");
      let resultText = "";

      if (intent === "visa" && APP_CONFIG.apiBaseUrl) {
        resultText = await runVisaResearch(text);
      } else if (intent === "browser" && APP_CONFIG.apiBaseUrl) {
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
          ? intent === "visa"
            ? `\n\n_Live official-source verification is unavailable (${err.message}). No volatile requirement was invented; the dossier marks live verification as required._`
            : `\n\n_Live AI pass failed (${err.message}). Delivered with the local studio agent instead._`
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

  const installApp = async () => {
    if (installPrompt.current) {
      await installPrompt.current.prompt();
      const choice = await installPrompt.current.userChoice;
      if (choice.outcome === "accepted") setInstallAvailable(false);
      installPrompt.current = null;
      return;
    }
    setInstallNotice("Use your browser menu and choose Install VisaMOTion AI or Add to Home Screen.");
    window.setTimeout(() => setInstallNotice(""), 5000);
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
            onScanWorkspace={() => setWorkspaceScanOpen(true)}
            onInstallApp={installApp}
            onOpenVisaSkills={() => {
              setActiveId("visa-agency-ops");
              setSidebarOpen(false);
            }}
            onOpenStudio={() => setStudioOpen(true)}
            onOpenChecklist={() => setChecklistOpen(true)}
            installAvailable={installAvailable}
            realtimeStatus={realtimeStatus}
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
      {workspaceScanOpen && <GoogleWorkspaceModal onClose={() => setWorkspaceScanOpen(false)} />}
      {studioOpen && <ClientStudioModal onClose={() => setStudioOpen(false)} onGenerate={(prompt) => { setStudioOpen(false); void send(prompt); }} />}
      {checklistOpen && <ChecklistModal onClose={() => setChecklistOpen(false)} />}
      {installNotice && <div className="fixed right-4 bottom-4 z-40 max-w-sm rounded-xl bg-neutral-900 px-4 py-3 text-[13px] text-white shadow-xl">{installNotice}</div>}
    </div>
  );
}

export default function App() {
  const adminRoute = window.location.pathname.replace(/\/$/, "") === "/admin" || new URLSearchParams(window.location.search).get("admin") === "1" || window.location.hash === "#admin";
  const role: AccessRole = adminRoute ? "admin" : "client";
  const [unlocked, setUnlocked] = useState(() => hasStoredSession(role));

  if (!unlocked) return <AccessGate role={role} onUnlock={() => setUnlocked(true)} />;
  if (adminRoute) return <AdminConsole onLogout={() => { clearSession("admin"); setUnlocked(false); }} />;
  return <WorkspaceApp />;
}
