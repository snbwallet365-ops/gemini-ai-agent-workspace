import { useState } from "react";
import { IconClose } from "./Icons";

type Profile = {
  name: string;
  target: string;
  course: string;
  institution: string;
  previous: string;
  job: string;
  goals: string;
  ties: string;
};

const blank: Profile = { name: "", target: "", course: "", institution: "", previous: "", job: "", goals: "", ties: "" };

export function ClientStudioModal({ onClose, onGenerate }: { onClose: () => void; onGenerate: (prompt: string) => void }) {
  const [type, setType] = useState<"SOP" | "Cover letter">("SOP");
  const [profile, setProfile] = useState<Profile>(blank);
  const update = (key: keyof Profile, value: string) => setProfile((current) => ({ ...current, [key]: value }));
  const generate = () => {
    const prompt = `Create a ${type} using the VisaMOTion AI drafting standard.\n\nClient profile:\n- Applicant name: ${profile.name || "Not provided"}\n- Target country and category: ${profile.target || "Not provided"}\n- Course: ${profile.course || "Not provided"}\n- Institution: ${profile.institution || "Not provided"}\n- Previous education: ${profile.previous || "Not provided"}\n- Job history: ${profile.job || "Not provided"}\n- Future career goal: ${profile.goals || "Not provided"}\n- Financial and home-country ties: ${profile.ties || "Not provided"}\n\nDeliver: 1) Academic Background & Progression, 2) Why This Country & University, 3) Career Plan & Financial Ties, 4) Human Review Warning. Do not invent facts. Flag every missing fact for review.`;
    onGenerate(prompt);
  };
  const field = (label: string, key: keyof Profile, placeholder: string) => <label className="block"><span className="mb-1 block text-[11.5px] font-medium text-neutral-600">{label}</span><input value={profile[key]} onChange={(event) => update(key, event.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-black/10 px-3 py-2 text-[12.5px] outline-none focus:border-[#1473ff]" /></label>;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-3 sm:items-center" onClick={onClose}>
      <div className="max-h-[92dvh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/6 bg-white px-5 py-3.5"><div><h2 className="text-[15px] font-semibold">SOP & cover letter studio</h2><p className="text-[11.5px] text-neutral-400">Draft from facts, then review before submission.</p></div><button type="button" className="rounded-md p-1 text-neutral-500 hover:bg-black/5" onClick={onClose}><IconClose size={14} /></button></div>
        <div className="space-y-4 px-5 py-5">
          <div className="flex gap-2">{(["SOP", "Cover letter"] as const).map((item) => <button key={item} type="button" onClick={() => setType(item)} className={`rounded-lg px-3 py-2 text-[12.5px] ${type === item ? "bg-[#1473ff] text-white" : "bg-black/[0.04] text-neutral-600"}`}>{item}</button>)}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {field("Applicant full name", "name", "Client Full Name")}
            {field("Target country and category", "target", "Australia Student Visa / Subclass 500")}
            {field("Target course", "course", "Master of Information Technology")}
            {field("Institution", "institution", "University name")}
            {field("Previous education", "previous", "Bachelor of Computer Science")}
            {field("Job history", "job", "Two years as a software engineer")}
            {field("Future career goal", "goals", "Career plan after the course")}
            {field("Financial and home-country ties", "ties", "Sponsor, family, property, return plan")}
          </div>
          <div className="rounded-xl bg-[#fff7e7] px-3 py-2.5 text-[12px] leading-relaxed text-amber-800">Human review required: compare names, passport details, tuition fees, and language scores before using the draft.</div>
        </div>
        <div className="flex justify-end gap-2 border-t border-black/6 px-5 py-3"><button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-neutral-600 hover:bg-black/5">Cancel</button><button type="button" onClick={generate} className="rounded-lg bg-[#1473ff] px-4 py-2 text-[13px] font-medium text-white">Draft {type}</button></div>
      </div>
    </div>
  );
}
