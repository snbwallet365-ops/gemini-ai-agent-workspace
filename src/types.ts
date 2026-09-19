export type ModelId =
  | "gemini-2.5-flash"
  | "gemini-2.5-pro"
  | "kimi-k3-high"
  | "kimi-k2"
  | "gpt-4.1";

export type ArtifactKind = "pdf" | "document" | "itinerary" | "analysis" | "code" | "website" | "image";

export type PlantTag = {
  label: string;
  tone: "dark" | "muted" | "soft";
};

export type PlantSpec = {
  label: string;
  icon: "sun" | "drop" | "ruler" | "leaf";
  text: string;
};

export type PlantPage = {
  id: string;
  name: string;
  latin: string;
  kicker: string;
  tags: PlantTag[];
  images: string[];
  about: string;
  specs: PlantSpec[];
  sources: { label: string; href: string }[];
};

export type ChatFile = {
  id: string;
  name: string;
  kind: string;
  artifactId: string;
};

export type AgentStep = {
  title: string;
  detail: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  durationLabel?: string;
  steps?: AgentStep[];
  files?: ChatFile[];
};

export type Artifact = {
  id: string;
  kind: ArtifactKind;
  title: string;
  fileName: string;
  pages?: PlantPage[];
  markdown?: string;
  html?: string;
  code?: string;
  language?: string;
  imageSvg?: string;
};

export type Project = {
  id: string;
  title: string;
  folder: string;
  messages: ChatMessage[];
  artifacts: Artifact[];
  activeArtifactId?: string;
  contextTokens: string;
  createdAt: number;
};

export type FolderDef = {
  id: string;
  name: string;
  icon: "folder" | "layout";
};
