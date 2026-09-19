export type VisaService = {
  id: string;
  country: string;
  route: string;
  summary: string;
  prompt: string;
};

export type LimitedOffer = {
  id: string;
  title: string;
  description: string;
  cta: string;
  enabled: boolean;
};

export const VISA_SERVICES: VisaService[] = [
  { id: "aus-500", country: "Australia", route: "Student visa · Subclass 500", summary: "Course, Genuine Student, finance and document-readiness support.", prompt: "Start an Australia Student visa Subclass 500 case review." },
  { id: "aus-491", country: "Australia", route: "Skilled visa · Subclass 491", summary: "Regional skilled route intake and evidence mapping.", prompt: "Start an Australia Skilled visa Subclass 491 route review." },
  { id: "aus-186", country: "Australia", route: "Employer nomination · Subclass 186", summary: "Employer-sponsored case intake and advisor handover preparation.", prompt: "Start an Australia Employer Nomination Subclass 186 case review." },
  { id: "can-study", country: "Canada", route: "Study permit", summary: "Study-plan, funds and supporting-document preparation.", prompt: "Start a Canada Study Permit case review." },
  { id: "can-express", country: "Canada", route: "Express Entry", summary: "Profile intake, ECA evidence map and next-action checklist.", prompt: "Start a Canada Express Entry profile review." },
  { id: "uk-student", country: "United Kingdom", route: "Student visa", summary: "Admission, financial evidence and application-readiness workflow.", prompt: "Start a UK Student visa case review." },
  { id: "uk-work", country: "United Kingdom", route: "Work permit", summary: "Sponsor, role and document preparation workflow.", prompt: "Start a UK Work Permit case review." },
  { id: "nz-green-list", country: "New Zealand", route: "Green List pathway", summary: "Role, qualification and evidence intake for human review.", prompt: "Start a New Zealand Green List pathway review." },
  { id: "us-f1", country: "United States", route: "F-1 Student visa", summary: "I-20, funding, interview and study-plan preparation.", prompt: "Start a US F-1 Student visa case review." },
  { id: "italy", country: "Italy", route: "Study and family routes", summary: "Route intake, appointment readiness and document checklist.", prompt: "Start an Italy visa route review." },
  { id: "serbia-eid", country: "Serbia", route: "eID and residence support", summary: "Digital identity, invitation and residence-document readiness.", prompt: "Start a Serbia eID and residence support review." },
  { id: "schengen", country: "Schengen", route: "Short-stay visit", summary: "Mission-specific checklist, funds, itinerary and biometrics preparation.", prompt: "Start a Schengen short-stay case review." },
];

export const LIMITED_OFFERS: LimitedOffer[] = [
  { id: "route-review", title: "Limited offer · Initial route review", description: "One structured route and document-gap review for a new client file. No approval or outcome is promised.", cta: "Request route review", enabled: true },
  { id: "sop-review", title: "Limited offer · SOP studio review", description: "Draft an SOP or cover letter from client-provided facts, then prepare it for human review.", cta: "Open SOP studio", enabled: true },
];
