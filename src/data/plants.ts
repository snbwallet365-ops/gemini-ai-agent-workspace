import type { PlantPage } from "../types";

const img = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const PLANT_PAGES: PlantPage[] = [
  {
    id: "fiddle-leaf-fig",
    name: "Fiddle-Leaf Fig",
    latin: "Ficus lyrata",
    kicker: "LARGE OFFICE PLANTS / NORTH-FACING LIGHT",
    tags: [
      { label: "Maximum impact", tone: "dark" },
      { label: "1.8–3 M indoors", tone: "muted" },
      { label: "Medium-high care", tone: "soft" },
    ],
    images: [img(8086277, 1400), img(11299541, 800), img(8086282, 800), img(7477929, 800), img(7477924, 800)],
    about:
      "A sculptural statement tree with large, violin-shaped leaves. It prefers bright, indirect light, so place it close to a large, unobstructed north-facing window or provide a grow light. Keep it away from drafts and avoid moving it once settled.",
    specs: [
      {
        label: "Light",
        icon: "sun",
        text: "Bright, indirect light. Position it close to a large north-facing window; supplement with a grow light if the room is dim.",
      },
      {
        label: "Water",
        icon: "drop",
        text: "Water thoroughly when the top 2–3 cm of soil is dry. Reduce watering in winter and never let the pot sit in water.",
      },
      {
        label: "Mature height",
        icon: "ruler",
        text: "Up to 3 m indoors; prune as needed to maintain clearance below the ceiling.",
      },
      {
        label: "Care level",
        icon: "leaf",
        text: "Medium–high. Sensitive to drafts, overwatering, and sudden changes in position.",
      },
    ],
    sources: [
      { label: "RHS – Ficus lyrata", href: "https://www.rhs.org.uk/plants/ficus-lyrata" },
      { label: "The Sill – Fiddle Leaf Fig Care", href: "https://www.thesill.com/blog/fiddle-leaf-fig-care" },
    ],
  },
  {
    id: "rubber-plant",
    name: "Rubber Plant",
    latin: "Ficus elastica",
    kicker: "LARGE OFFICE PLANTS / NORTH-FACING LIGHT",
    tags: [
      { label: "Reliable statement", tone: "dark" },
      { label: "1.5–2.5 M indoors", tone: "muted" },
      { label: "Easy–medium care", tone: "soft" },
    ],
    images: [img(7189341, 1400), img(15391325, 800), img(8989431, 800), img(7187568, 800), img(5726034, 800)],
    about:
      "Glossy, architectural leaves and a strong vertical habit make Ficus elastica a dependable office tree. It copes better with north-facing light than a fiddle-leaf fig, especially if placed within 1–2 m of the glass. Wipe leaves monthly so they can photosynthesize in lower light.",
    specs: [
      {
        label: "Light",
        icon: "sun",
        text: "Medium to bright indirect light. North-facing windows are acceptable; rotate the pot every few weeks for even growth.",
      },
      {
        label: "Water",
        icon: "drop",
        text: "Water when the top 4–5 cm of soil is dry. Rubber plants dislike soggy roots more than brief dryness.",
      },
      {
        label: "Mature height",
        icon: "ruler",
        text: "Typically 1.5–2.5 m indoors; can be pruned hard and will resprout from woody stems.",
      },
      {
        label: "Care level",
        icon: "leaf",
        text: "Easy–medium. More forgiving than Ficus lyrata and well suited to shared office care.",
      },
    ],
    sources: [
      { label: "Missouri Botanical Garden – Ficus elastica", href: "https://www.missouribotanicalgarden.org" },
    ],
  },
  {
    id: "monstera",
    name: "Swiss Cheese Plant",
    latin: "Monstera deliciosa",
    kicker: "LARGE OFFICE PLANTS / NORTH-FACING LIGHT",
    tags: [
      { label: "High visual volume", tone: "dark" },
      { label: "1.5–2.4 M indoors", tone: "muted" },
      { label: "Easy care", tone: "soft" },
    ],
    images: [img(17883164, 1400), img(19923748, 800), img(12058426, 800), img(12253088, 800), img(5942503, 800)],
    about:
      "Fenestrated leaves give Monstera a tropical, gallery-like presence without needing a south window. In New York north light it will grow more slowly and fenestrations may be fewer unless a grow light is added. A moss pole keeps the plant within a 3 m ceiling.",
    specs: [
      {
        label: "Light",
        icon: "sun",
        text: "Medium, indirect light. North-facing rooms work if the plant sits close to the window wall.",
      },
      {
        label: "Water",
        icon: "drop",
        text: "Water when the top third of the mix is dry. Aerial roots can be trained into the pot or a moss pole.",
      },
      {
        label: "Mature height",
        icon: "ruler",
        text: "1.5–2.4 m climbing; train and prune to stay well below a 3 m ceiling.",
      },
      {
        label: "Care level",
        icon: "leaf",
        text: "Easy. Tolerates some neglect and is a strong candidate for shared office watering.",
      },
    ],
    sources: [
      { label: "University of Florida – Monstera", href: "https://gardeningsolutions.ifas.ufl.edu" },
    ],
  },
  {
    id: "kentia-palm",
    name: "Kentia Palm",
    latin: "Howea forsteriana",
    kicker: "LARGE OFFICE PLANTS / NORTH-FACING LIGHT",
    tags: [
      { label: "Low-light champion", tone: "dark" },
      { label: "2–3 M indoors", tone: "muted" },
      { label: "Easy care", tone: "soft" },
    ],
    images: [img(15448195, 1400), img(6913619, 800), img(6913612, 800), img(6913617, 800), img(7193660, 800)],
    about:
      "The classic Victorian parlor palm for modern offices. Kentia is one of the best large palms for north-facing rooms: elegant, slow-growing, and tolerant of lower light and dry HVAC air. Fronds arch rather than spike, so it reads as soft architecture under a 3 m ceiling.",
    specs: [
      {
        label: "Light",
        icon: "sun",
        text: "Low to medium indirect light. Excellent at a north window; avoid harsh midday sun through adjacent glass.",
      },
      {
        label: "Water",
        icon: "drop",
        text: "Keep evenly moist but never waterlogged. Allow the top 2 cm to dry, then water thoroughly.",
      },
      {
        label: "Mature height",
        icon: "ruler",
        text: "Slow to 2–3 m indoors. Rarely needs aggressive pruning; remove only brown fronds at the base.",
      },
      {
        label: "Care level",
        icon: "leaf",
        text: "Easy. Among the most office-proof large palms, with high tolerance for north light.",
      },
    ],
    sources: [
      { label: "Royal Botanic Gardens, Kew – Howea forsteriana", href: "https://www.kew.org" },
    ],
  },
  {
    id: "bird-of-paradise",
    name: "White Bird of Paradise",
    latin: "Strelitzia nicolai",
    kicker: "LARGE OFFICE PLANTS / NORTH-FACING LIGHT",
    tags: [
      { label: "Sculptural volume", tone: "dark" },
      { label: "2–3 M indoors", tone: "muted" },
      { label: "Medium care", tone: "soft" },
    ],
    images: [img(23632363, 1400), img(11741645, 800), img(20314956, 800), img(7193701, 800), img(7888656, 800)],
    about:
      "Banana-like paddles create an instant lobby presence. Strelitzia nicolai wants more light than a Kentia, so in a north-facing New York office it should sit directly in the window bay or receive a full-spectrum grow light. Indoors it rarely flowers; it is grown for foliage scale.",
    specs: [
      {
        label: "Light",
        icon: "sun",
        text: "Bright, indirect light. North glass is workable if unobstructed; add a grow light 1.5–2 m above the crown if the room is deep.",
      },
      {
        label: "Water",
        icon: "drop",
        text: "Water when the top 3–4 cm is dry in the growing season. Cut back in winter. Dust leaves so they capture every lumen.",
      },
      {
        label: "Mature height",
        icon: "ruler",
        text: "Easily 2–3 m indoors. Split congested clumps rather than topping, to keep a natural silhouette.",
      },
      {
        label: "Care level",
        icon: "leaf",
        text: "Medium. Needs consistent light and space; otherwise straightforward watering and feeding.",
      },
    ],
    sources: [
      { label: "North Carolina Extension – Strelitzia", href: "https://plants.ces.ncsu.edu" },
    ],
  },
  {
    id: "dracaena",
    name: "Corn Plant",
    latin: "Dracaena fragrans",
    kicker: "LARGE OFFICE PLANTS / NORTH-FACING LIGHT",
    tags: [
      { label: "Low-light upright", tone: "dark" },
      { label: "1.5–2.5 M indoors", tone: "muted" },
      { label: "Easy care", tone: "soft" },
    ],
    images: [img(17075214, 1400), img(10907051, 800), img(6913621, 800), img(22863428, 800), img(14348174, 800)],
    about:
      "Cane-forming Dracaena is a north-facing workhorse: upright, narrow footprint, and famously tolerant of office light. Multiple canes at staggered heights fill vertical space without crowding desks. NASA-era studies also list it among plants that help with indoor air quality — a useful talking point for workplace wellness.",
    specs: [
      {
        label: "Light",
        icon: "sun",
        text: "Low to medium indirect light. One of the safest large plants for deep north-facing rooms.",
      },
      {
        label: "Water",
        icon: "drop",
        text: "Allow the top half of the pot to dry. Overwatering is the main failure mode, especially in winter HVAC.",
      },
      {
        label: "Mature height",
        icon: "ruler",
        text: "1.5–2.5 m on canes. Cut a cane anywhere and it will resprout, making ceiling clearance trivial.",
      },
      {
        label: "Care level",
        icon: "leaf",
        text: "Easy. Ideal if watering will be done by facilities rather than a plant specialist.",
      },
    ],
    sources: [
      { label: "NASA Clean Air Study – Dracaena", href: "https://ntrs.nasa.gov" },
    ],
  },
];
