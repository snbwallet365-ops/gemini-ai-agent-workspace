import { useEffect, useMemo, useState } from "react";
import type { Project } from "../types";
import { getPortalSummary, type PortalDocument, type PortalSummary } from "../lib/portal";
import { LIMITED_OFFERS, VISA_SERVICES } from "../data/visaServices";
import { IconClose, IconDocTab } from "./Icons";

type Tab = "routes" | "offers" | "documents";

export function ClientServicesModal({ projects, onClose, onStartCase, onOpenArtifact }: { projects: Project[]; onClose: () => void; onStartCase: (prompt: string) => void; onOpenArtifact: (projectId: string, artifactId: string) => void }) {
  const [tab, setTab] = useState<Tab>("routes");
  const [summary, setSummary] = useState<PortalSummary>({ notice: "", offers: LIMITED_OFFERS, documents: [] });
  const [selectedPdf, setSelectedPdf] = useState<PortalDocument | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void getPortalSummary().then(setSummary).catch((err) => setError(err instanceof Error ? err.message : "Client services could not be loaded."));
  }, []);

  const artifacts = useMemo(() => projects.flatMap((project) => project.artifacts.filter((artifact) => /\.pdf$/i.test(artifact.fileName)).map((artifact) => ({ projectId: project.id, projectTitle: project.title, artifact }))), [projects]);
  const offers = summary.offers.length ? summary.offers : LIMITED_OFFERS;
  const documents = summary.documents.length ? summary.documents : [{ id: "insus-guide", title: "INSUS Visa Operations service guide", description: "Client journey and service workflow.", url: "/insus-service-guide.pdf", kind: "pdf" as const }];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-3 sm:items-center" onClick={onClose}>
      <section className="flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-black/6 px-5 py-4">
          <div className="flex items-center gap-2"><IconDocTab size={16} className="text-[#1473ff]" /><div><h2 className="text-[16px] font-semibold">Client services</h2><p className="text-[11.5px] text-neutral-400">Routes, limited offers and PDFs in one app-like space.</p></div></div>
          <button type="button" className="rounded-md p-1 text-neutral-500 hover:bg-black/5" onClick={onClose} aria-label="Close client services"><IconClose size={14} /></button>
        </header>
        <div className="flex gap-1 overflow-x-auto border-b border-black/6 px-4 py-2">
          {(["routes", "offers", "documents"] as const).map((item) => <button key={item} type="button" onClick={() => { setTab(item); setSelectedPdf(null); }} className={`rounded-lg px-3 py-2 text-[12.5px] capitalize ${tab === item ? "bg-[#1473ff] text-white" : "text-neutral-600 hover:bg-black/5"}`}>{item === "routes" ? "Visa routes" : item === "offers" ? "Limited offers" : "Client PDFs"}</button>)}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5 sm:p-6">
          {summary.notice && <div className="mb-4 rounded-xl bg-[#fff7e7] px-3 py-2.5 text-[12px] leading-relaxed text-amber-800">{summary.notice}</div>}
          {error && <div className="mb-4 rounded-xl bg-red-50 px-3 py-2.5 text-[12px] text-red-700">{error}</div>}
          {tab === "routes" && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{VISA_SERVICES.map((service) => <article key={service.id} className="rounded-2xl border border-black/8 bg-[#fafafa] p-4"><div className="text-[11px] font-semibold tracking-wide text-[#1473ff] uppercase">{service.country}</div><h3 className="mt-1 text-[14px] font-semibold text-neutral-900">{service.route}</h3><p className="mt-2 min-h-[42px] text-[12px] leading-relaxed text-neutral-500">{service.summary}</p><button type="button" onClick={() => onStartCase(service.prompt)} className="mt-3 rounded-lg bg-[#1473ff] px-3 py-2 text-[12px] font-medium text-white">Start review</button></article>)}</div>}
          {tab === "offers" && <div className="grid gap-3 sm:grid-cols-2">{offers.filter((offer) => offer.enabled).map((offer) => <article key={offer.id} className="rounded-2xl border border-[#1473ff]/20 bg-[#eef5ff] p-5"><div className="text-[11px] font-semibold tracking-wide text-[#1473ff] uppercase">Limited offer</div><h3 className="mt-1 text-[16px] font-semibold text-neutral-900">{offer.title.replace(/^Limited offer · /, "")}</h3><p className="mt-2 text-[13px] leading-relaxed text-neutral-600">{offer.description}</p><button type="button" onClick={() => onStartCase(offer.cta)} className="mt-4 rounded-lg bg-[#1473ff] px-3 py-2 text-[12px] font-medium text-white">{offer.cta}</button></article>)}</div>}
          {tab === "documents" && <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]"> <div className="space-y-2">{documents.map((document) => <button key={document.id} type="button" onClick={() => setSelectedPdf(document)} className={`w-full rounded-xl border px-3 py-3 text-left ${selectedPdf?.id === document.id ? "border-[#1473ff] bg-[#eef5ff]" : "border-black/8 hover:bg-black/[0.03]"}`}><div className="text-[13px] font-medium text-neutral-800">{document.title}</div><div className="mt-1 text-[11.5px] leading-relaxed text-neutral-500">{document.description}</div></button>)}{artifacts.map(({ projectId, projectTitle, artifact }) => <button key={`${projectId}-${artifact.id}`} type="button" onClick={() => onOpenArtifact(projectId, artifact.id)} className="w-full rounded-xl border border-black/8 px-3 py-3 text-left hover:bg-black/[0.03]"><div className="text-[13px] font-medium text-neutral-800">{artifact.fileName}</div><div className="mt-1 text-[11.5px] text-neutral-500">Generated in {projectTitle}</div></button>)}</div><div className="min-h-[360px] overflow-hidden rounded-xl border border-black/8 bg-[#f6f6f6]">{selectedPdf ? <iframe title={selectedPdf.title} src={selectedPdf.url} className="h-[54dvh] min-h-[360px] w-full" /> : <div className="flex h-full min-h-[360px] items-center justify-center px-6 text-center text-[13px] text-neutral-400">Choose a PDF to view it inside the client app.</div>}</div></div>}
        </div>
        <footer className="flex justify-end border-t border-black/6 px-5 py-3"><button type="button" onClick={onClose} className="rounded-lg bg-[#1473ff] px-4 py-2 text-[13px] font-medium text-white">Close</button></footer>
      </section>
    </div>
  );
}
