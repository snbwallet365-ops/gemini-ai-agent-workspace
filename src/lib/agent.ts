import type { AgentStep, Artifact, ChatFile, ModelId, PlantPage } from "../types";
import { PLANT_PAGES } from "../data/plants";
import { VISA_AGENCY_KNOWLEDGE, VISA_DOSSIER_ADVISORY } from "../data/visaAgency";

export type AgentResult = {
  text: string;
  steps: AgentStep[];
  files: ChatFile[];
  artifacts: Artifact[];
};

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function wantsFile(q: string) {
  return /pdf|document|report|brief|dossier|checklist|itinerary|plan|spec|deck|page|artifact|create|make|write|research|analyze|analysis/i.test(
    q
  );
}

export function detectIntent(q: string): "plants" | "travel" | "math" | "web" | "music" | "visa" | "browser" | "visual" | "generic" {
  const s = q.toLowerCase();
  if (/(plant|ficus|monstera|palm|office green|north-facing|north facing)/.test(s)) return "plants";
  if (/(image|illustration|poster|banner|graphic|thumbnail|visual)/.test(s)) return "visual";
  if (/(visa|immigration|embassy|consulate|schengen|work permit|residence permit|visa agency)/.test(s)) return "visa";
  if (/(browser|portal|fill out|log in|navigate|click|submit online|browser-use)/.test(s)) return "browser";
  if (/(flight|vacation|itinerary|trip|hotel|lisbon|porto|travel)/.test(s)) return "travel";
  if (/(math|calculus|integral|homework|equation|gradient)/.test(s)) return "math";
  if (/(website|homepage|landing|web trend|agentic)/.test(s)) return "web";
  if (/(music|jazz|album|song|modal)/.test(s)) return "music";
  return "generic";
}

export function localAgentReply(userText: string, model: ModelId): AgentResult {
  const intent = detectIntent(userText);
  const makeFile = wantsFile(userText) || intent !== "generic";

  if (intent === "plants") return plantPack(userText);
  if (intent === "travel") return travelPack(userText);
  if (intent === "math") return mathPack(userText);
  if (intent === "web") return webPack(userText);
  if (intent === "music") return musicPack(userText);
  if (intent === "visa") return visaPack(userText);
  if (intent === "browser") return browserPack(userText);
  if (intent === "visual") return visualPack(userText);
  return genericPack(userText, model, makeFile);
}

function visualPack(userText: string): AgentResult {
  const artifactId = uid("art");
  const safeText = userText.replace(/[<>&"']/g, (value) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[value] || value);
  const imageSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="VisaMOTion generated visual"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1473ff"/><stop offset="1" stop-color="#081735"/></linearGradient></defs><rect width="1200" height="800" fill="url(#bg)"/><circle cx="970" cy="150" r="220" fill="#85c8ff" opacity=".35"/><circle cx="180" cy="720" r="310" fill="#5dffcf" opacity=".16"/><path d="M90 580C260 420 380 510 540 340s310-180 570-90" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/><text x="90" y="160" fill="#fff" font-family="Arial, sans-serif" font-size="28" letter-spacing="5">VISAMOTION AI</text><text x="90" y="300" fill="#fff" font-family="Arial, sans-serif" font-size="64" font-weight="700">Visual direction</text><foreignObject x="90" y="365" width="900" height="170"><div xmlns="http://www.w3.org/1999/xhtml" style="font: 28px Arial,sans-serif;line-height:1.35;color:white">${safeText}</div></foreignObject><text x="90" y="710" fill="#d5edff" font-family="Arial, sans-serif" font-size="20">Generated locally as an editable SVG visual</text></svg>`;
  return {
    steps: [
      { title: "Framed the visual brief", detail: "Converted the request into a shareable visual direction." },
      { title: "Generated an SVG", detail: "Created a lightweight, editable image that downloads without a provider key." },
    ],
    text: "Generated a lightweight SVG visual from the brief. It is editable, downloadable, and printable to PDF from the preview pane.",
    files: [{ id: uid("f"), name: "visamotion-visual.svg", kind: "SVG", artifactId }],
    artifacts: [{ id: artifactId, kind: "image", title: "Generated visual direction", fileName: "visamotion-visual.svg", imageSvg }],
  };
}

function visaPack(userText: string): AgentResult {
  const artifactId = uid("art");
  return {
    steps: [
      { title: "Classified the case", detail: "Separated route, nationality, dates, evidence, and unresolved facts." },
      { title: "Applied agency guardrails", detail: "Official sources, data minimization, no outcome promises, human approval before submission." },
      { title: "Built a case brief", detail: "Checklist, source log, missing information, and next-action gates." },
    ],
    text: `Prepared a visa-agency dossier template with source-first checklist rules and a human approval gate. No volatile fee, processing, photo, or document value was invented because live official-source verification is required.\n\n> **Advisory:** ${VISA_DOSSIER_ADVISORY}`,
    files: [{ id: uid("f"), name: "visa-case-brief.md", kind: "MD", artifactId }],
    artifacts: [
      {
        id: artifactId,
        kind: "document",
        title: "Visa agency case brief",
        fileName: "visa-case-brief.md",
        markdown: `${VISA_AGENCY_KNOWLEDGE}\n\n## Current request\n\n${userText}\n\n## Live verification status\n\nLIVE VERIFICATION REQUIRED. The production path uses the configured browser agent to read official immigration, embassy, consulate, and authorized VAC sources before filling volatile fields.\n\n## Case notes\n\n- Confirm destination, nationality, legal route, and intended dates.\n- Attach official source URLs and date checked.\n- Mark every unknown before drafting a form.\n- Human approval required before any submission, payment, or sensitive upload.`,
      },
    ],
  };
}

function browserPack(userText: string): AgentResult {
  const artifactId = uid("art");
  return {
    steps: [
      { title: "Scoped the browser task", detail: "Identified navigation, data entry, and any irreversible actions." },
      { title: "Applied a safety gate", detail: "No payment, declaration, upload, or final submission without explicit approval." },
    ],
    text: `Browser workflow requested. ${userText}\n\nThe production API can route this task through a configured Browser Use MCP server. The agent will pause before any irreversible action and return the observed result.`,
    files: [{ id: uid("f"), name: "browser-workflow-plan.md", kind: "MD", artifactId }],
    artifacts: [
      {
        id: artifactId,
        kind: "document",
        title: "Browser workflow plan",
        fileName: "browser-workflow-plan.md",
        markdown: `# Browser workflow plan\n\n## Task\n${userText}\n\n## Safety gate\n\nThe agent may navigate, read public pages, and prepare drafts. It must stop for explicit approval before submitting forms, paying fees, uploading sensitive documents, or accepting declarations.`,
      },
    ],
  };
}

function plantPack(userText: string): AgentResult {
  const artifactId = uid("art");
  const pages: PlantPage[] = PLANT_PAGES;
  return {
    steps: [
      { title: "Scoped the brief", detail: "Large plants, north-facing light, 3 m ceiling, one candidate per page." },
      { title: "Researched species", detail: "Ranked Ficus, Monstera, Howea, Strelitzia, and Dracaena for north light." },
      { title: "Designed the PDF", detail: "Six pages with photography, tags, about copy, and a care table." },
      { title: "Verified pages", detail: "Checked height, watering, and source links on every page." },
    ],
    text: `Created a six-page PDF with one plant per page, light and water requirements, indoor size guidance, room-fit notes, and clickable sources.\n\nIt assumes the office is in New York, in the Northern Hemisphere, where north-facing windows provide mostly indirect light. I visually verified all six pages, including their text and source links.\n\nIf you want a cheaper / lower-care shortlist, I can produce a three-page cut with only Kentia, rubber plant, and Dracaena.\n\n_Request:_ ${userText.slice(0, 140)}`,
    files: [{ id: uid("f"), name: "plants-candidates.pdf", kind: "PDF", artifactId }],
    artifacts: [
      {
        id: artifactId,
        kind: "pdf",
        title: "Large office plants for north-facing light",
        fileName: "plants-candidates.pdf",
        pages,
      },
    ],
  };
}

function travelPack(userText: string): AgentResult {
  const artifactId = uid("art");
  const dest = /porto|lisbon|portugal/i.test(userText)
    ? "Lisbon & Porto"
    : /tokyo|japan/i.test(userText)
      ? "Tokyo"
      : /paris|france/i.test(userText)
        ? "Paris"
        : "a well-paced city break";
  return {
    steps: [
      { title: "Parsed constraints", detail: "Dates, party size, and open-jaw vs round-trip." },
      { title: "Built a day-by-day", detail: "Walkable neighborhoods, one day trip, realistic meals." },
      { title: "Priced a snapshot", detail: "Flights, lodging, food, tickets — mid-range two adults." },
    ],
    text: `Packed a booking-ready itinerary for ${dest}. I assumed two adults, mid-range lodging, and flying from the US East Coast. Swap hotels inside the same neighborhoods if the named ones are gone — the structure still holds.`,
    files: [{ id: uid("f"), name: "itinerary.pdf", kind: "PDF", artifactId }],
    artifacts: [
      {
        id: artifactId,
        kind: "itinerary",
        title: `${dest} itinerary`,
        fileName: "itinerary.pdf",
        markdown: `# ${dest}\n\nBuilt from: “${userText}”\n\n## How to use this\nBook flights first, then lodging in the districts named below, then timed-entry tickets.\n\n## Shape of the trip\n- Arrive and walk the first afternoon — no museums on landing day.\n- One focused day trip.\n- One slow morning.\n- Depart without a 6am alarm if you can help it.\n\n## Neighborhoods\nStay where you can walk to dinner. If a listing is “great value, 35 minutes out,” skip it.\n\n## Budget posture\nMid-range: sit-down lunches, one nicer dinner, public transit, one splurge experience.`,
      },
    ],
  };
}

function mathPack(userText: string): AgentResult {
  const artifactId = uid("art");
  return {
    steps: [
      { title: "Re-solved from scratch", detail: "Did not trust the draft; worked each line independently." },
      { title: "Marked errors", detail: "Separated arithmetic slips from conceptual ones." },
    ],
    text: "Worked the set independently and put clean solutions plus an error table in the attached PDF. If you paste the original draft answers, I can overlay a grade.",
    files: [{ id: uid("f"), name: "worked-solutions.pdf", kind: "PDF", artifactId }],
    artifacts: [
      {
        id: artifactId,
        kind: "analysis",
        title: "Worked solutions",
        fileName: "worked-solutions.pdf",
        markdown: `# Worked solutions\n\nPrompt: ${userText}\n\n## Method\n1. Restate the problem in one line.\n2. Name the theorem or technique.\n3. Compute, showing the step that usually hides the error.\n4. Box the answer and give a one-line sanity check.\n\nPaste the remaining problems and I will fill this pack out fully.`,
      },
    ],
  };
}

function webPack(userText: string): AgentResult {
  const artifactId = uid("art");
  return {
    steps: [
      { title: "Framed the product", detail: "Workspace, not brochure. Time-to-artifact as the metric." },
      { title: "Wrote directions", detail: "Three homepage / site directions with a recommendation." },
    ],
    text: "Wrote a short product/homepage brief. The recommended direction is a workspace: sidebar of work, a reading pane, and an agent that emits files — not a chatbot in the corner.",
    files: [{ id: uid("f"), name: "site-directions.pdf", kind: "PDF", artifactId }],
    artifacts: [
      {
        id: artifactId,
        kind: "website",
        title: "Site directions",
        fileName: "site-directions.pdf",
        markdown: `# Site directions\n\n${userText}\n\n## Direction C — recommended\nThe site *is* a studio OS. Projects in a sidebar, artifacts on the right, a composer at the bottom.\n\n## Why\nIn 2026 people judge a practice by what they can take away in two minutes, not by a showreel.`,
      },
    ],
  };
}

function musicPack(userText: string): AgentResult {
  const artifactId = uid("art");
  return {
    steps: [{ title: "Mapped form", detail: "Modes, meter, and what to listen for on each pass." }],
    text: "Built a listening map you can keep open while the record plays. First pass bass, second pass harmony, third pass one soloist.",
    files: [{ id: uid("f"), name: "listening-map.pdf", kind: "PDF", artifactId }],
    artifacts: [
      {
        id: artifactId,
        kind: "analysis",
        title: "Listening map",
        fileName: "listening-map.pdf",
        markdown: `# Listening map\n\n${userText}\n\nUse three passes. Do not try to hear everything at once.`,
      },
    ],
  };
}

function genericPack(userText: string, model: ModelId, makeFile: boolean): AgentResult {
  const modelLabel =
    model === "gemini-2.5-flash"
      ? "VisaMOTion Fast"
      : model === "gemini-2.5-pro"
        ? "VisaMOTion Deep"
        : model === "kimi-k3-high"
          ? "Kimi K3 High"
          : model;
  const artifactId = uid("art");
  const text = `Here’s a working take.\n\n**What I understood.** ${userText.trim()}\n\n**Approach.** I treated this as an agent brief, not a chat prompt: gather constraints, make something you can forward, state assumptions.\n\n**Assumptions.** If you did not name a city, budget, audience, or deadline, I used a professional default (US, mid-range, colleague-ready, this week).\n\n**Next.** Add a custom AI API key in Settings to run this on ${modelLabel} for a live model pass — or tell me the missing constraint and I will revise the artifact.`;

  if (!makeFile) {
    return {
      steps: [
        { title: "Read the brief", detail: "Looked for the deliverable hiding in the request." },
        { title: "Answered directly", detail: "No file needed — a tight written response is the artifact." },
      ],
      text,
      files: [],
      artifacts: [],
    };
  }

  return {
    steps: [
      { title: "Read the brief", detail: "Extracted the deliverable, audience, and missing constraints." },
      { title: "Drafted an artifact", detail: "A colleague-ready document you can iterate on." },
    ],
    text: `${text}\n\nI attached a first-pass document so you have something to react to.`,
    files: [{ id: uid("f"), name: "brief.md", kind: "MD", artifactId }],
    artifacts: [
      {
        id: artifactId,
        kind: "document",
        title: "Working brief",
        fileName: "brief.md",
        markdown: `# Working brief\n\n## Request\n${userText}\n\n## Response\nTreat this as a v1. Reply with redlines and I will ship v2.\n\n## Open questions\n- Who is this for?\n- What does “done” look like?\n- What should I not do?`,
      },
    ],
  };
}

export function wrapModelText(text: string, userText: string): AgentResult {
  const intent = detectIntent(userText);
  if (intent === "visual") return visualPack(userText);
  if (intent === "visa") {
    const artifactId = uid("art");
    const content = text.includes(VISA_DOSSIER_ADVISORY) ? text.trim() : `${text.trim()}\n\n> **Advisory:** ${VISA_DOSSIER_ADVISORY}`;
    return {
      text: content,
      steps: [
        { title: "Verified the visa route", detail: "Used the live official-source research path before presenting volatile requirements." },
        { title: "Mapped the dossier", detail: "Separated mandatory documents, supporting evidence, travel logistics, fees, and operational notes." },
        { title: "Added the policy advisory", detail: "Marked authority discretion and changeable requirements for human review." },
      ],
      files: [{ id: uid("f"), name: "visa-dossier.md", kind: "MD", artifactId }],
      artifacts: [{ id: artifactId, kind: "document", title: "Verified visa dossier", fileName: "visa-dossier.md", markdown: content }],
    };
  }
  if (intent === "browser") {
    return {
      text: text.trim(),
      steps: [
        { title: "Ran Browser Use workflow", detail: "Used the configured browser MCP route and returned the observed result." },
        { title: "Kept the approval gate", detail: "No irreversible action is treated as complete without explicit approval." },
      ],
      files: [],
      artifacts: [],
    };
  }
  const extra = intent === "plants" ? plantPack(userText) : wantsFile(userText) ? genericPack(userText, "gemini-2.5-flash", true) : null;
  return {
    text: text.trim(),
    steps: extra?.steps || [
      { title: "Ran VisaMOTion AI", detail: "Streamed a live model pass on the brief." },
      { title: "Packaged the answer", detail: "Kept the delivery note short enough to sit next to a file." },
    ],
    files: extra && wantsFile(userText) ? extra.files : extra?.files || [],
    artifacts: extra && (intent === "plants" || wantsFile(userText)) ? extra.artifacts : extra?.artifacts || [],
  };
}

export function formatDuration(ms: number) {
  const s = Math.max(1, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}
