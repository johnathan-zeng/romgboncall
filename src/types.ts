export type FlowTag = "cns" | "thoracic" | "bleeding" | "gi" | "general";

export type FlowCitation = {
  id: string;
  title: string;
  citation: string;
};

export type FlowFigure = {
  id: string;
  title: string;
  src: string;
  caption: string;
};

export type FlowOutcome = {
  title: string;
  urgency: string;
  summary: string;
  immediateActions: string[];
  consults: string[];
  rtConsiderations: string[];
  notes?: string[];
};

export type FlowChoice = {
  label: string;
  next: string;
  detail?: string;
};

export type FlowNode = {
  id: string;
  prompt: string;
  detail: string;
  choices?: FlowChoice[];
  outcome?: FlowOutcome;
};

export type EmergencyFlow = {
  id: string;
  title: string;
  shortTitle: string;
  category: FlowTag;
  chiefComplaint: string;
  synopsis: string;
  redFlags: string[];
  workup: string[];
  defaultConsults: string[];
  commonDoseFx: string[];
  citations: FlowCitation[];
  figures: FlowFigure[];
  nodes: FlowNode[];
};

export type QuickSection = {
  title: string;
  items: string[];
};

export type TaperPlan = {
  label: string;
  schedule: string[];
  note?: string;
};

export type PhoneGuide = {
  id: string;
  title: string;
  synopsis: string;
  firstSteps: string[];
  edTriggers: string[];
  communication: string[];
  nodes: FlowNode[];
  sections: QuickSection[];
  tapers: TaperPlan[];
};
