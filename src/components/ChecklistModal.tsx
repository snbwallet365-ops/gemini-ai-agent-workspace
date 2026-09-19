import { useMemo, useState } from "react";
import { IconClose } from "./Icons";

const CHECKLISTS: Record<string, string[]> = {
  "Australia student": ["Passport and validity check", "Application form and identity documents", "Confirmation of Enrolment", "English-language evidence", "Financial capacity evidence", "Genuine Student statement", "Health and character checks"],
  "Serbia eID": ["Passport and legal residence proof", "Digital identity / eID access", "Application form", "Invitation or purpose evidence", "Accommodation evidence", "Financial evidence", "Insurance and travel details"],
  "Italy": ["Passport and application form", "Biometric photographs", "Proof of legal status", "Admission or invitation evidence", "Financial and employment evidence", "Accommodation evidence", "Insurance and appointment confirmation"],
  "Schengen": ["Passport with verified validity and blank pages", "Application form", "35 x 45 mm photo rule, verify with the mission", "Legal residence proof", "Bank statements and employment evidence", "Return itinerary and accommodation", "Travel insurance, verify coverage amount", "Biometrics appointment"],
};

export function ChecklistModal({ onClose }: { onClose: () => void }) {
  const [route, setRoute] = useState(Object.keys(CHECKLISTS)[0]);
  const [files, setFiles] = useState<string[]>([]);
  const items = CHECKLISTS[route];
  const audit = useMemo(() => ({ passport: files.some((file) => /passport/i.test(file)), invitation: files.some((file) => /invitation|admission|enrol/i.test(file)) }), [files]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-3 sm:items-center" onClick={onClose}>
      <div className="max-h-[92dvh] w-full max-w-xl overflow-auto rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-black/6 px-5 py-3.5"><div><h2 className="text-[15px] font-semibold">Live visa checklist</h2><p className="text-[11.5px] text-neutral-400">Template only until official sources are verified.</p></div><button type="button" className="rounded-md p-1 text-neutral-500 hover:bg-black/5" onClick={onClose}><IconClose size={14} /></button></div>
        <div className="space-y-4 px-5 py-5">
          <select value={route} onChange={(event) => setRoute(event.target.value)} className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-[13px] outline-none focus:border-[#1473ff]">{Object.keys(CHECKLISTS).map((item) => <option key={item}>{item}</option>)}</select>
          <div className="space-y-2">{items.map((item) => <label key={item} className="flex items-start gap-2 rounded-lg border border-black/8 px-3 py-2 text-[12.5px] text-neutral-700"><input type="checkbox" className="mt-0.5 accent-[#1473ff]" /> <span>{item}</span></label>)}</div>
          <label className="block rounded-xl border border-dashed border-black/15 px-3 py-3 text-[12.5px] text-neutral-500">Add document names for a quick local audit<input type="file" multiple className="mt-2 block w-full text-[12px]" onChange={(event) => setFiles(Array.from(event.target.files || []).map((file) => file.name))} /></label>
          <div className="rounded-xl bg-[#f7f7f7] px-3 py-3 text-[12px] text-neutral-600"><div className="mb-1 font-medium text-neutral-800">Quick audit</div><div>Passport filename: <span className={audit.passport ? "text-emerald-600" : "text-amber-600"}>{audit.passport ? "found" : "not found"}</span></div><div>Invitation/admission filename: <span className={audit.invitation ? "text-emerald-600" : "text-amber-600"}>{audit.invitation ? "found" : "not found"}</span></div><p className="mt-2 text-neutral-400">This checks filenames only. It does not replace an official requirement review.</p></div>
        </div>
        <div className="flex justify-end border-t border-black/6 px-5 py-3"><button type="button" onClick={onClose} className="rounded-lg bg-[#1473ff] px-4 py-2 text-[13px] font-medium text-white">Close checklist</button></div>
      </div>
    </div>
  );
}
