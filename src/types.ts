export type FlowTag = "cns" | "thoracic" | "bleeding" | "gi" | "general";

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
  sources: string[];
  nodes: FlowNode[];
};
