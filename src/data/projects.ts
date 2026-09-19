import type { FolderDef, Project } from "../types";
import { PLANT_PAGES } from "./plants";
import { VISA_AGENCY_KNOWLEDGE } from "./visaAgency";

export const FOLDERS: FolderDef[] = [
  { id: "general", name: "General", icon: "folder" },
  { id: "creative", name: "Creative Projects", icon: "folder" },
  { id: "personal", name: "Personal website", icon: "layout" },
  { id: "visa-agency", name: "Visa Agency", icon: "layout" },
];

const now = Date.now();

export const SEED_PROJECTS: Project[] = [
  {
    id: "office-plant-selection",
    title: "Office Plant Selection",
    folder: "general",
    contextTokens: "231.7K",
    createdAt: now - 86400000 * 2,
    activeArtifactId: "plants-pdf",
    artifacts: [
      {
        id: "plants-pdf",
        kind: "pdf",
        title: "Large office plants for north-facing light",
        fileName: "plants-candidates.pdf",
        pages: PLANT_PAGES,
      },
    ],
    messages: [
      {
        id: "m1",
        role: "user",
        createdAt: now - 86400000 * 2,
        content:
          "Research large office plants suited to north-facing light and a 3 m ceiling. Create a PDF with one candidate per page, including images and a table of light and watering requirements.",
      },
      {
        id: "m2",
        role: "assistant",
        createdAt: now - 86400000 * 2 + 724000,
        durationLabel: "12m 4s",
        steps: [
          {
            title: "Scoped the brief",
            detail: "North-facing New York office, 3 m ceiling, large statement plants, one candidate per PDF page.",
          },
          {
            title: "Researched species",
            detail: "Compared Ficus, Monstera, Howea, Strelitzia, and Dracaena against north light and indoor height data.",
          },
          {
            title: "Checked room-fit",
            detail: "Filtered for plants that stay at or under 3 m with pruning, and noted grow-light fallbacks.",
          },
          {
            title: "Designed the PDF",
            detail: "Six pages with hero photography, tags, about copy, and a light/water/height/care table.",
          },
          {
            title: "Verified pages",
            detail: "Visually checked all six pages, captions, and source links before delivery.",
          },
        ],
        content:
          "Created a six-page PDF with one plant per page, light and water requirements, indoor size guidance, room-fit notes, and clickable sources.\n\nIt assumes the office is in New York, in the Northern Hemisphere, where north-facing windows provide mostly indirect light. I visually verified all six pages, including their text and source links.",
        files: [
          {
            id: "f1",
            name: "plants-candidates.pdf",
            kind: "PDF",
            artifactId: "plants-pdf",
          },
        ],
      },
    ],
  },
  {
    id: "math-homework",
    title: "Math Homework Analysis",
    folder: "general",
    contextTokens: "84.2K",
    createdAt: now - 86400000 * 5,
    activeArtifactId: "math-doc",
    artifacts: [
      {
        id: "math-doc",
        kind: "analysis",
        title: "Calculus problem set — worked solutions",
        fileName: "calc-set-04-solutions.pdf",
        markdown: `# Calculus Set 04 — Worked Solutions

**Student:** A. Chen · **Course:** Multivariable Calculus · **Due:** Friday

## 1. Gradient and directional derivative

Let \( f(x,y) = x^2 y + e^{xy} \). Find \( \\nabla f \) at \( (1,0) \) and the directional derivative toward \( \\mathbf{u} = \\langle 3,4 \\rangle \).

**Gradient**

\[
f_x = 2xy + y e^{xy}, \\quad f_y = x^2 + x e^{xy}
\]

\[
\\nabla f(1,0) = \\langle 0, 1 + 1 \\rangle = \\langle 0, 2 \\rangle
\]

**Direction**

\[
\\hat{\\mathbf{u}} = \\langle 3/5,\\, 4/5 \\rangle, \\quad D_{\\mathbf{u}} f(1,0) = \\langle 0,2 \\rangle \\cdot \\langle 3/5, 4/5 \\rangle = 8/5
\]

## 2. Double integral

Evaluate \( \\displaystyle \\iint_R (2x + y)\\, dA \) where \( R \) is the triangle with vertices \( (0,0), (1,0), (0,2) \).

\[
\\int_{x=0}^{1} \\int_{y=0}^{2-2x} (2x + y)\\, dy\\, dx = \\int_0^1 \\Big[ 2xy + \\tfrac{1}{2} y^2 \\Big]_0^{2-2x}\\, dx = \\frac{5}{3}
\]

## 3. Line integral of a conservative field

\( \\mathbf{F} = \\langle 2x + y,\\, x + 2y \\rangle \). Show \( \\mathbf{F} \) is conservative, find a potential, and evaluate from \( (0,0) \) to \( (1,1) \).

Curl is zero in \( \\mathbb{R}^2 \). Potential \( \\varphi = x^2 + xy + y^2 \).

\[
\\int_C \\mathbf{F}\\cdot d\\mathbf{r} = \\varphi(1,1) - \\varphi(0,0) = 3
\]

## Error notes on the submitted draft

| Problem | Draft answer | Verdict | Note |
|---|---|---|---|
| 1 | \( 2 \) | Close | Missed unit vector — used \( \\langle 3,4 \\rangle \) raw |
| 2 | \( 2 \) | Incorrect | Wrong inner limit \( y=2 \) instead of \( y=2-2x \) |
| 3 | \( 2 \) | Incorrect | Potential missing the \( xy \) term |

**Suggested score:** 6 / 12 with partial credit on (1).`,
      },
    ],
    messages: [
      {
        id: "mh1",
        role: "user",
        createdAt: now - 86400000 * 5,
        content:
          "Analyze this multivariable calculus homework. Check each solution, flag mistakes, and produce a clean worked-solution PDF I can study from.",
      },
      {
        id: "mh2",
        role: "assistant",
        createdAt: now - 86400000 * 5 + 180000,
        durationLabel: "3m 12s",
        steps: [
          { title: "Parsed the problem set", detail: "Three questions: gradient, double integral, conservative field." },
          { title: "Re-solved independently", detail: "Worked each problem from scratch before comparing to the draft." },
          { title: "Marked errors", detail: "Unit vector missed on (1); domain error on (2); incomplete potential on (3)." },
        ],
        content:
          "Worked all three problems independently and compared them to the draft. Problem 1 is almost right (directional derivative used a non-unit vector). Problems 2 and 3 have domain / potential errors. I put full solutions, a score suggestion, and an error table in the attached PDF.",
        files: [{ id: "mf1", name: "calc-set-04-solutions.pdf", kind: "PDF", artifactId: "math-doc" }],
      },
    ],
  },
  {
    id: "vacation",
    title: "Vacation and Flight Planning",
    folder: "general",
    contextTokens: "156.4K",
    createdAt: now - 86400000 * 8,
    activeArtifactId: "trip-doc",
    artifacts: [
      {
        id: "trip-doc",
        kind: "itinerary",
        title: "Lisbon & Porto — 8 day itinerary",
        fileName: "lisbon-porto-itinerary.pdf",
        markdown: `# Lisbon & Porto · 8 days

**Travelers:** 2 adults · **Dates:** 12–19 June · **Home airport:** JFK

## Flights (recommended)

| Leg | Flight | Depart | Arrive | Notes |
|---|---|---|---|---|
| JFK → LIS | TAP TP210 | 12 Jun 22:35 | 13 Jun 10:55 | Overnight, 1 bag included |
| OPO → JFK | TAP TP209 via LIS | 19 Jun 11:20 | 19 Jun 18:50 | 7h 30m total |

*Book TAP as a round-trip open-jaw (JFK–LIS, OPO–JFK). Current cash fare ~ $780 pp economy.*

## Lodging

- **Lisbon (4 nights):** Santa Catarina / Príncipe Real. Look at Memmo Príncipe Real or an apartment on Rua de São Bento.
- **Porto (3 nights):** Ribeira or Vitória. Torel Palace or a riverside studio near Palácio da Bolsa.

## Day by day

**13 Jun — Arrive Lisbon**  
Drop bags, walk downhill through Bairro Alto to Time Out Market. Sunset at Miradouro de Santa Catarina.

**14 Jun — Belém + river**  
Tram 15 or rideshare to Jerónimos, Pastéis de Belém (go next door to Manteigaria if the line is brutal), MAAT exterior, LX Factory.

**15 Jun — Alfama & fado**  
Castelo de São Jorge at opening, wander Alfama, evening fado at a small casa (Mesa de Frades or Povo).

**16 Jun — Sintra day trip**  
Train from Rossio. Palácio da Pena + Quinta da Regaleira. Back in Lisbon for a late dinner in Cais do Sodré.

**17 Jun — Rail to Porto**  
Alfa Pendular 09:32–12:29. Check in, walk Ribeira, Dom Luís I bridge at dusk.

**18 Jun — Gaia & tasting**  
Taylor’s or Graham’s for a structured tasting, lunch in Vila Nova de Gaia, Livraria Lello timed ticket, Clérigos.

**19 Jun — Depart**  
Morning francesinha if you dare, then OPO.

## Budget snapshot (2 people)

| Item | Estimate |
|---|---|
| Open-jaw flights | $1,560 |
| Trains & local transit | $180 |
| Hotels | $1,720 |
| Food & wine | $1,100 |
| Tickets / tastings | $260 |
| **Total** | **~$4,820** |`,
      },
    ],
    messages: [
      {
        id: "v1",
        role: "user",
        createdAt: now - 86400000 * 8,
        content:
          "Plan an 8-day Portugal trip from New York for two people in June. Open-jaw flights, Lisbon then Porto, mid-range budget. Give me a booking-ready itinerary.",
      },
      {
        id: "v2",
        role: "assistant",
        createdAt: now - 86400000 * 8 + 290000,
        durationLabel: "4m 51s",
        content:
          "Built an 8-day Lisbon → Porto itinerary with TAP open-jaw flights from JFK, neighborhood lodging, a Sintra day trip, and a budget snapshot around $4,820 for two. The PDF is booking-ready — swap hotel names if those sell out, but keep the same districts.",
        files: [{ id: "vf1", name: "lisbon-porto-itinerary.pdf", kind: "PDF", artifactId: "trip-doc" }],
      },
    ],
  },
  {
    id: "pdf-analysis",
    title: "PDF Analysis Request",
    folder: "general",
    contextTokens: "412.0K",
    createdAt: now - 86400000 * 10,
    activeArtifactId: "pdf-brief",
    artifacts: [
      {
        id: "pdf-brief",
        kind: "document",
        title: "Q3 vendor contract — risk brief",
        fileName: "q3-contract-risk-brief.pdf",
        markdown: `# Q3 Vendor Contract — Risk Brief

**Document:** MSA-2041-A · **Counterparty:** Northwind Logistics · **Term:** 24 months

## Executive summary

The MSA is commercially standard except for three clauses that should be negotiated before signature: auto-renew with a 90-day notice window, uncapped indemnity for “data incidents,” and a limitation of liability that excludes your own lost profits but not theirs.

## Clause watchlist

1. **§4.2 Auto-renewal** — Renews for successive 12-month terms unless notice is given 90 days prior. Recommend 30-day notice and a one-time renewal cap.
2. **§9 Indemnity** — Unlimited indemnity for any “data incident,” defined broadly enough to include your own employee error. Cap at 12 months of fees and mutualize.
3. **§11 Liability cap** — 6 months of fees, but carve-outs are asymmetric. Make carve-outs reciprocal.
4. **§14.1 Governing law** — Delaware, with venue in Wilmington. Acceptable.
5. **DPAs / subprocessors** — Exhibit C lists four subprocessors; two are missing SCCs. Request updated exhibit.

## Recommended redlines

- Cap indemnity at 12 months’ fees except for IP infringement and willful misconduct.
- Shrink renewal notice to 30 days.
- Add a termination-for-convenience after month 12 with 45 days’ notice.
- Require 72-hour breach notification.

## Verdict

**Sign after redlines.** Not a walk-away, but do not accept the indemnity or auto-renew as drafted.`,
      },
    ],
    messages: [
      {
        id: "p1",
        role: "user",
        createdAt: now - 86400000 * 10,
        content: "Read this vendor MSA and tell me what I should actually negotiate. I need a one-page risk brief for legal.",
      },
      {
        id: "p2",
        role: "assistant",
        createdAt: now - 86400000 * 10 + 210000,
        durationLabel: "3m 28s",
        content:
          "The MSA is signable after three redlines: auto-renew notice, uncapped data-incident indemnity, and an asymmetric liability cap. Full clause watchlist and recommended language are in the attached one-page brief.",
        files: [{ id: "pf1", name: "q3-contract-risk-brief.pdf", kind: "PDF", artifactId: "pdf-brief" }],
      },
    ],
  },
  {
    id: "creative-agentic",
    title: "Creative Agentic AI Project",
    folder: "creative",
    contextTokens: "198.6K",
    createdAt: now - 86400000 * 3,
    activeArtifactId: "agent-spec",
    artifacts: [
      {
        id: "agent-spec",
        kind: "document",
        title: "Studio agent — product spec",
        fileName: "studio-agent-spec.md",
        markdown: `# Studio Agent

A creative director that lives in the file system.

## Job

Turn a one-line brief into a campaign pack: positioning, visual direction, copy deck, and a motion storyboard — without waiting on a 12-person review.

## Agent loop

1. **Brief intake** — extract audience, offer, constraints, brand voice.
2. **World build** — 3 territory options, each with a tension and a cultural hook.
3. **Make** — generate copy, art direction, and a 15s storyboard in parallel.
4. **Critique** — a second pass that scores against the brief, not against taste.
5. **Package** — Figma-ready frames + a client PDF.

## Why it works

Most “creative GPTs” stop at adjectives. Studio Agent is graded on *shipped artifacts*. If it cannot export a board, it did not finish.

## Stack

 VisaMOTion Fast for the fast loop, a slower reasoning pass for critique, and a layout renderer for the PDF/Figma pack.`,
      },
    ],
    messages: [
      {
        id: "c1",
        role: "user",
        createdAt: now - 86400000 * 3,
        content: "Help me spec a creative agentic AI product that actually ships campaign work, not moodboards.",
      },
      {
        id: "c2",
        role: "assistant",
        createdAt: now - 86400000 * 3 + 160000,
        durationLabel: "2m 44s",
        content:
          "Drafted Studio Agent: a five-step loop that goes brief → territories → make → critique → package. The point of the product is exported artifacts, not chat. Spec is attached.",
        files: [{ id: "cf1", name: "studio-agent-spec.md", kind: "MD", artifactId: "agent-spec" }],
      },
    ],
  },
  {
    id: "music",
    title: "Interactive Music Analysis",
    folder: "creative",
    contextTokens: "67.9K",
    createdAt: now - 86400000 * 6,
    activeArtifactId: "music-doc",
    artifacts: [
      {
        id: "music-doc",
        kind: "analysis",
        title: "Kind of Blue — modal map",
        fileName: "kind-of-blue-modal-map.pdf",
        markdown: `# Kind of Blue — a listening map

Recorded March–April 1959, Columbia 30th Street. Five tunes, two sessions, almost no rehearsal.

## So What

- **Form:** 32-bar AABA, but modal rather than ii–V–I.
- **A sections:** D Dorian. **Bridge:** a whole step up, E♭ Dorian, then back.
- **Piano:** Bill Evans’ voicings are quartal — stacked fourths — which is why the head feels like architecture, not chords.
- **Why it still works:** the soloists are not “in D minor”; they are coloring a mode. Listen for Coltrane leaving Dorian via the raised 7th.

## Freddie Freeloader

Blues in B♭, but Wynton Kelly (not Evans) on piano. The swing is more conventional; use it as a control group against the modal tracks.

## Blue in Green

10-bar circular form. The melody is Evans’; the harmony keeps folding in on itself. Count 10, not 12.

## All Blues

6/8 blues in G Mixolydian. The vamp is the composition. Drummer Jimmy Cobb’s ride is the metronome the whole record leans on.

## Flamenco Sketches

Five scales, cued by Evans. Miles, Coltrane, Adderley, Evans each take a pass. This is the most “interactive” track on the record — the analysis is in the cueing, not the changes.

## How to listen interactively

1. First pass: only the bass. Chambers is the map.
2. Second pass: piano voicings against that bass.
3. Third: one soloist. Ignore the rest.
4. Then the full field.`,
      },
    ],
    messages: [
      {
        id: "mu1",
        role: "user",
        createdAt: now - 86400000 * 6,
        content: "Build an interactive analysis of Kind of Blue I can use while listening. Modes, form, and what to pay attention to.",
      },
      {
        id: "mu2",
        role: "assistant",
        createdAt: now - 86400000 * 6 + 200000,
        durationLabel: "3m 18s",
        content:
          "Mapped all five tracks: So What and Flamenco Sketches are the modal core, Freddie Freeloader is the blues control, Blue in Green is a 10-bar circle, All Blues is 6/8 Mixolydian. Listening recipe is in the PDF.",
        files: [{ id: "muf1", name: "kind-of-blue-modal-map.pdf", kind: "PDF", artifactId: "music-doc" }],
      },
    ],
  },
  {
    id: "creative-ideas",
    title: "Creative Project Ideas",
    folder: "creative",
    contextTokens: "44.1K",
    createdAt: now - 86400000 * 12,
    activeArtifactId: "ideas-doc",
    artifacts: [
      {
        id: "ideas-doc",
        kind: "document",
        title: "Twelve projects worth making",
        fileName: "twelve-projects.md",
        markdown: `# Twelve projects worth making

1. **A newspaper that only covers one city block.**
2. **A typeface generated from a person’s handwriting over a year.**
3. **A cookbook of recipes that fail on purpose, with notes on why.**
4. **A walking tour scored like a film, GPS-triggered.**
5. **An archive of every sign in a disappearing mall.**
6. **A children’s book about a municipal budget.**
7. **A scent library for a neighborhood (bakery, subway, rain on stoops).**
8. **A website that gets slower as you scroll, on purpose.**
9. **A choir that only sings voicemails.**
10. **A map of shade in August.**
11. **A brand identity for a fictional public utility.**
12. **A plant-selection agent for north-facing offices.**`,
      },
    ],
    messages: [
      {
        id: "ci1",
        role: "user",
        createdAt: now - 86400000 * 12,
        content: "Give me a dozen creative project ideas that are specific, slightly strange, and actually makeable.",
      },
      {
        id: "ci2",
        role: "assistant",
        createdAt: now - 86400000 * 12 + 90000,
        durationLabel: "1m 22s",
        content: "Twelve ideas, all makeable in a season. Number 4 and 10 are the ones I would start this month.",
        files: [{ id: "cif1", name: "twelve-projects.md", kind: "MD", artifactId: "ideas-doc" }],
      },
    ],
  },
  {
    id: "homepage",
    title: "Homepage Variations",
    folder: "personal",
    contextTokens: "121.3K",
    createdAt: now - 86400000 * 4,
    activeArtifactId: "home-doc",
    artifacts: [
      {
        id: "home-doc",
        kind: "website",
        title: "Homepage directions",
        fileName: "homepage-directions.pdf",
        markdown: `# Homepage directions

Personal site for a designer-engineer hybrid. Three directions, one recommended.

## A — Quiet index
A single column. Name, one sentence, a list of projects with years. No hero image. This is the Framer / Index school. Best if the work is strong enough to not need theatre.

## B — Studio frame
Full-bleed still from the latest piece, name in the corner, work as a horizontal filmstrip. Feels like a gallery. Risky if the stills are inconsistent.

## C — Operating system (recommended)
The homepage *is* a workspace: a sidebar of projects, a reading pane, an agent you can ask about the work. It is self-referential, but it is also honest about how you actually work in 2026.

## Copy, direction C

**Name:** Amara Cole  
**Line:** I design systems that look like rooms, and rooms that behave like software.  
**CTA:** Ask the studio agent, or just open a project.

## Type
- UI: Inter / SF Pro
- Display: a sharp grotesque, not a serif, unless the work is editorial.

## Color
Warm gray workspace, one electric blue for selection — the same blue as a selected Finder item.`,
      },
    ],
    messages: [
      {
        id: "h1",
        role: "user",
        createdAt: now - 86400000 * 4,
        content: "Explore homepage variations for my personal site. I want it to feel like a studio, not a résumé.",
      },
      {
        id: "h2",
        role: "assistant",
        createdAt: now - 86400000 * 4 + 150000,
        durationLabel: "2m 31s",
        content:
          "Three directions. I would ship C — the homepage as a workspace — because it matches how you actually work and avoids the generic studio reel. Notes on type, copy, and color are in the PDF.",
        files: [{ id: "hf1", name: "homepage-directions.pdf", kind: "PDF", artifactId: "home-doc" }],
      },
    ],
  },
  {
    id: "agentic-web",
    title: "Agentic AI Website Ideas",
    folder: "personal",
    contextTokens: "88.0K",
    createdAt: now - 86400000 * 7,
    activeArtifactId: "web-ideas",
    artifacts: [
      {
        id: "web-ideas",
        kind: "document",
        title: "Agentic website concepts",
        fileName: "agentic-websites.md",
        markdown: `# Agentic website concepts

A website that only displays is a brochure. A website that *does the work* is a product.

## 1. The hiring site that interviews you back
Portfolio + an agent that asks three sharp questions about a case study, then emails the founder a briefing.

## 2. The restaurant site that seats you
Not a reservation iframe. The agent knows the floor plan, the allergies, the window table, and texts when it is actually ready.

## 3. The city guide that walks with you
Location-aware, quiet, and willing to shut up. The site is a companion, not a listicle.

## 4. The personal site with a studio agent
Visitors ask “what would you make for a north-facing office?” and get a real artifact, not a contact form.

## 5. The docs site that files the PR
Read the docs, describe the bug, watch the agent open a pull request against the example repo.`,
      },
    ],
    messages: [
      {
        id: "aw1",
        role: "user",
        createdAt: now - 86400000 * 7,
        content: "I want website ideas where an AI agent is the interface, not a chatbot widget in the corner.",
      },
      {
        id: "aw2",
        role: "assistant",
        createdAt: now - 86400000 * 7 + 120000,
        durationLabel: "2m 05s",
        content:
          "Five concepts where the agent *is* the site: hiring, restaurants, walking guides, a studio that delivers artifacts, and docs that file PRs. Number 4 is the one that matches your personal site.",
        files: [{ id: "awf1", name: "agentic-websites.md", kind: "MD", artifactId: "web-ideas" }],
      },
    ],
  },
  {
    id: "web-trends",
    title: "2026 Web Trends",
    folder: "personal",
    contextTokens: "173.5K",
    createdAt: now - 86400000,
    activeArtifactId: "trends-doc",
    artifacts: [
      {
        id: "trends-doc",
        kind: "document",
        title: "2026 web trends — field notes",
        fileName: "2026-web-trends.pdf",
        markdown: `# 2026 web trends — field notes

## 1. Workspaces, not pages
The winning consumer and prosumer sites look like tools: three panes, a composer, an artifact. Chat is the input; the document is the output.

## 2. Agents with files
If your agent cannot hand you a PDF, a PR, or a spreadsheet, it is a chatbot. File-shaped output is the new “read more.”

## 3. Quiet luxury UI
Hairline borders, system type, one accent blue. The 2021 glassmorphism hangover is over. Interfaces look like macOS Settings, not Dribbble shots.

## 4. On-device + flash models
 Fast agent models made “always-on agent in the sidebar” economically sane. People now expect a thinking timer, not a typing indicator.

## 5. North-star metric: time-to-artifact
Homepage bounce is the wrong number. How fast did the visitor get something they could forward to a colleague?

## 6. Personal sites as operating systems
A résumé is a PDF. A practice is a workspace you can ask questions of.

## What to ignore
- 3D heroes that take 4 seconds to hydrate
- “Meet your new AI copilot” banners
- Infinite vertical scroll of case-study thumbnails with no way to interrogate the work`,
      },
    ],
    messages: [
      {
        id: "t1",
        role: "user",
        createdAt: now - 86400000,
        content: "What actually matters on the web in 2026? Skip the recycled “AI will change everything” deck.",
      },
      {
        id: "t2",
        role: "assistant",
        createdAt: now - 86400000 + 140000,
        durationLabel: "2m 18s",
        content:
          "Six notes. The useful ones: workspaces instead of pages, agents that emit files, and time-to-artifact as the metric. I also listed three things to stop doing. PDF attached.",
        files: [{ id: "tf1", name: "2026-web-trends.pdf", kind: "PDF", artifactId: "trends-doc" }],
      },
    ],
  },
  {
    id: "visa-agency-ops",
    title: "Visa Agency Operations",
    folder: "visa-agency",
    contextTokens: "92.4K",
    createdAt: now - 86400000,
    activeArtifactId: "visa-knowledge",
    artifacts: [
      {
        id: "visa-knowledge",
        kind: "document",
        title: "Visa agency knowledge and safeguards",
        fileName: "visa-agency-knowledge.md",
        markdown: VISA_AGENCY_KNOWLEDGE,
      },
    ],
    messages: [
      {
        id: "visa-ops-1",
        role: "user",
        createdAt: now - 86400000,
        content: "Set up an operating knowledge pack for a visa agency that can research official requirements and prepare case checklists safely.",
      },
      {
        id: "visa-ops-2",
        role: "assistant",
        createdAt: now - 86400000 + 120000,
        durationLabel: "2m 02s",
        steps: [
          { title: "Defined the agency role", detail: "Operations support, not legal advice or an immigration decision-maker." },
          { title: "Added case workflow", detail: "Intake, route check, evidence map, review, approval gate, and follow-up." },
          { title: "Added browser safeguards", detail: "No payment, declaration, sensitive upload, or final submission without approval." },
        ],
        content: "Added a source-first visa-agency knowledge pack with case intake, document checklists, browser safety gates, and human review points. The workspace does not promise approval or retain secrets.",
        files: [{ id: "visa-ops-file", name: "visa-agency-knowledge.md", kind: "MD", artifactId: "visa-knowledge" }],
      },
    ],
  },
];
