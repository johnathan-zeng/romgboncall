import { EmergencyFlow, FlowCitation, FlowFigure } from "../types";

const citationLibrary: Record<string, FlowCitation> = {
  cns: {
    id: "cns",
    title: "ARRO CNS Emergencies",
    citation:
      "Vera A, Dias Neto, Medina A, Freret M. Radiation Oncology On-Call Handbook: CNS emergencies. Association of Residents in Radiation Oncology. December 2025.",
  },
  thoracicAirway: {
    id: "thoracicAirway",
    title: "ARRO Airway Obstruction",
    citation:
      "Arthur M, Doss VL, Kozono D. Radiation Oncology On-Call Handbook: Airway Obstruction. Association of Residents in Radiation Oncology. January 23, 2026.",
  },
  thoracicHemoptysis: {
    id: "thoracicHemoptysis",
    title: "ARRO Hemoptysis",
    citation:
      "Arthur M, Doss VL, Kozono D. Radiation Oncology On-Call Handbook: Hemoptysis. Association of Residents in Radiation Oncology. January 23, 2026.",
  },
  bleeding: {
    id: "bleeding",
    title: "ARRO Tumor Bleeding",
    citation:
      "Zhao S, Neibart SS, Turner BE. Radiation Oncology On-Call Handbook: Palliative Radiation for Tumor Bleeding. Association of Residents in Radiation Oncology. September 15, 2025.",
  },
  gi: {
    id: "gi",
    title: "ARRO GI Emergencies",
    citation:
      "Ho A. Radiation Oncology On-Call Handbook: Gastrointestinal Emergencies. Association of Residents in Radiation Oncology. September 15, 2025.",
  },
  paradigm: {
    id: "paradigm",
    title: "General Paradigms of Palliative RT",
    citation:
      "Ho A. Palliative RT: General Paradigms and Concepts. Peer reviewed by the ARRO Education Subcommittee.",
  },
  manuscript: {
    id: "manuscript",
    title: "Inpatient Radiation Oncology and On-Call Emergencies",
    citation:
      "Neibart SS. Inpatient Radiation Oncology and On-Call Emergencies. Department of Radiation Oncology, Mass General Brigham.",
  },
};

const figureLibrary: Record<string, FlowFigure> = {
  airway: {
    id: "airway",
    title: "Airway obstruction algorithm",
    src: "/figures/ARRO%20Airway%20Obstruction.png",
    caption: "Click to enlarge the airway obstruction algorithm.",
  },
  airwayAlt: {
    id: "airwayAlt",
    title: "Airway obstruction algorithm (alternate export)",
    src: "/figures/ARRO%20Airway%20Obstruction%202.png",
    caption: "Alternate exported version of the airway obstruction figure.",
  },
  bleeding: {
    id: "bleeding",
    title: "Tumor bleeding algorithm",
    src: "/figures/ARRO%20Bleeding.png",
    caption: "Click to enlarge the general tumor bleeding algorithm.",
  },
  bowel: {
    id: "bowel",
    title: "Bowel obstruction algorithm",
    src: "/figures/ARRO%20Bowel%20Obstruction.png",
    caption: "Click to enlarge the malignant bowel obstruction algorithm.",
  },
  brain: {
    id: "brain",
    title: "Brain metastasis algorithm",
    src: "/figures/ARRO%20Brain%20Metastasis.png",
    caption: "Click to enlarge the brain metastasis algorithm.",
  },
  dysphagia: {
    id: "dysphagia",
    title: "Dysphagia algorithm",
    src: "/figures/ARRO%20Dysphagia.png",
    caption: "Click to enlarge the esophageal/EGJ obstruction algorithm.",
  },
  giBleeding: {
    id: "giBleeding",
    title: "GI bleeding algorithm",
    src: "/figures/ARRO%20GI%20Bleeding.png",
    caption: "Click to enlarge the GI bleeding algorithm.",
  },
  hemoptysis: {
    id: "hemoptysis",
    title: "Hemoptysis algorithm",
    src: "/figures/ARRO%20Hemoptysis.png",
    caption: "Click to enlarge the hemoptysis algorithm.",
  },
  lmd1: {
    id: "lmd1",
    title: "LMD diagnostic algorithm",
    src: "/figures/ARRO%20LMD.png",
    caption: "Click to enlarge the leptomeningeal disease diagnostic pathway.",
  },
  lmd2: {
    id: "lmd2",
    title: "LMD treatment algorithm",
    src: "/figures/ARRO%20LMD%202.png",
    caption: "Click to enlarge the leptomeningeal disease treatment pathway.",
  },
};

const citations = (...ids: Array<keyof typeof citationLibrary>) =>
  ids.map((id) => citationLibrary[id]);

const figures = (...ids: Array<keyof typeof figureLibrary>) =>
  ids.map((id) => figureLibrary[id]);

export const emergencyFlows: EmergencyFlow[] = [
  {
    id: "brain-metastases",
    title: "Brain Metastases",
    shortTitle: "Brain Mets",
    category: "cns",
    chiefComplaint:
      "Headache, nausea/vomiting, seizure, focal deficit, vision change, or cognitive change.",
    synopsis:
      "Large lesion and resectability first, then select among postoperative focal RT, SRS, or whole-brain approaches.",
    redFlags: [
      "Large lesion with mass effect",
      "Seizure activity",
      "Rapid neurologic decline",
      "Elevated ICP symptoms",
      "Progressive mental status change",
    ],
    workup: [
      "MRI brain with contrast",
      "Focused neurologic exam",
      "Systemic staging if diagnosis is new or unclear",
      "Review systemic options with CNS activity",
    ],
    defaultConsults: ["Neurosurgery", "Medical oncology", "Radiation oncology"],
    commonDoseFx: [
      "WBRT 30 Gy in 10 fractions",
      "HA-WBRT 30 Gy in 10 fractions + memantine",
      "SRS: <=2 cm 20 Gy x 1, 2-3 cm 18 Gy x 1, 3 cm 15 Gy x 1",
      "Post-op cavity SRT: often 25 Gy in 5 fractions",
    ],
    citations: citations("cns", "manuscript"),
    figures: figures("brain"),
    nodes: [
      {
        id: "start",
        prompt: "Is there a large lesion greater than 4 cm or clinically meaningful mass effect?",
        detail: "The figure prioritizes lesion size and mass effect before selecting focal or whole-brain approaches.",
        choices: [
          { label: "Yes", next: "resectable" },
          { label: "No", next: "limited-disease" },
        ],
      },
      {
        id: "resectable",
        prompt: "Is the patient ECOG 0-2 with a resectable lesion or diagnostic uncertainty that favors tissue?",
        detail: "If yes, the figure routes toward resection followed by postoperative focal radiation; diagnostic uncertainty can also support surgery even without symptoms.",
        choices: [
          { label: "Yes, good surgical candidate", next: "postop-outcome" },
          { label: "No, not resectable or poor candidate", next: "systemic-outcome" },
        ],
      },
      {
        id: "limited-disease",
        prompt: "If surgery is not leading the path, does the intracranial burden fit focal treatment?",
        detail: "Use this to separate SRS/SRT-style strategies from whole-brain approaches.",
        choices: [
          { label: "Yes, focal treatment fits", next: "srs-outcome" },
          { label: "No, broader intracranial coverage needed", next: "wb-outcome" },
        ],
      },
      {
        id: "postop-outcome",
        prompt: "Postoperative focal pathway",
        detail: "Resection followed by cavity-directed treatment.",
        outcome: {
          title: "Resection Followed by Post-op Focal RT",
          urgency: "High",
          summary:
            "The figure favors resection for a large resectable lesion in a good candidate, then postoperative cavity RT rather than reflex WBRT.",
          immediateActions: [
            "Coordinate neurosurgical resection planning",
            "Confirm pathology and postop imaging",
            "Plan postoperative cavity RT after recovery",
          ],
          consults: ["Neurosurgery", "Radiation oncology", "Medical oncology"],
          rtConsiderations: [
            "Post-op cavity SRT often 25 Gy in 5 fractions",
            "For larger or critical cavity cases, 27-30 Gy in 5 fractions may be considered",
          ],
        },
      },
      {
        id: "systemic-outcome",
        prompt: "Systemic-led pathway",
        detail: "Nonresectable large lesion pathway from the figure.",
        outcome: {
          title: "Systemic-Therapy-Led Evaluation With RT Technique Selection",
          urgency: "Moderate to high",
          summary:
            "When the lesion is large but not resectable, the figure points toward systemic therapy review or definitive RT, then an RT technique chosen by disease distribution and goals.",
          immediateActions: [
            "Review targeted or systemic options with CNS activity",
            "Clarify if urgent symptom control is still needed from definitive RT",
            "Plan simulation approach and immobilization if RT proceeds",
          ],
          consults: ["Medical oncology", "Radiation oncology", "Neurosurgery as needed"],
          rtConsiderations: [
            "Definitive RT or broader intracranial RT may be needed depending on burden and intent",
            "Focal techniques can still be considered selectively if anatomy allows",
          ],
        },
      },
      {
        id: "srs-outcome",
        prompt: "Focal RT pathway",
        detail: "SRS/SRT-style route.",
        outcome: {
          title: "Focal SRS / SRT Approach",
          urgency: "Moderate",
          summary:
            "For limited disease without a resection-led path, the figure favors focal radiation techniques rather than routine WBRT.",
          immediateActions: [
            "Confirm lesion count and size on high-quality MRI",
            "Assess proximity to hippocampi and eloquent structures",
            "Choose single-fraction or short-course focal treatment based on size",
          ],
          consults: ["Radiation oncology", "Medical oncology"],
          rtConsiderations: [
            "SRS examples from the figure: <=2 cm 20 Gy x 1, 2-3 cm 18 Gy x 1, 3 cm 15 Gy x 1",
            "Post-op cavity treatments are treated separately from intact-lesion SRS",
          ],
        },
      },
      {
        id: "wb-outcome",
        prompt: "Whole-brain pathway",
        detail: "Diffuse or broader intracranial burden.",
        outcome: {
          title: "WBRT / HA-WBRT Pathway",
          urgency: "Moderate",
          summary:
            "If intracranial disease burden is not well served by focal treatment alone, the figure routes toward WBRT or hippocampal-avoidance WBRT with memantine when appropriate.",
          immediateActions: [
            "Start memantine if HA-WBRT or WBRT is chosen and clinically appropriate",
            "Assess candidacy for hippocampal avoidance",
            "Review simulation setup including aquaplast mask",
          ],
          consults: ["Radiation oncology", "Medical oncology"],
          rtConsiderations: [
            "WBRT 30 Gy in 10 fractions",
            "Memantine should be paired with WBRT/HA-WBRT when appropriate",
            "HA-WBRT 30 Gy in 10 fractions; avoid HA-WBRT in SCLC, leptomeningeal disease, or hippocampal-adjacent metastases",
          ],
        },
      },
    ],
  },
  {
    id: "leptomeningeal-disease",
    title: "Leptomeningeal Disease",
    shortTitle: "LMD",
    category: "cns",
    chiefComplaint:
      "Headache, nausea/vomiting, cranial neuropathies, multifocal deficits, radicular pain, or cauda equina symptoms.",
    synopsis:
      "Confirm the diagnosis, address symptoms first, then decide whether treatment is bridging to systemic therapy or primarily symptom-directed.",
    redFlags: [
      "Hydrocephalus or elevated ICP concern",
      "Rapid neurologic decline",
      "Cranial neuropathies",
      "Cauda equina symptoms",
      "Poor performance status with uncontrolled symptoms",
    ],
    workup: [
      "Confirm diagnosis with MRI and CSF studies when feasible",
      "Clarify whether symptoms are present and controlled",
      "Assess KPS and bridge-to-systemic-therapy potential",
      "Review targeted and intrathecal options",
    ],
    defaultConsults: ["Neuro-oncology", "Neurosurgery", "Radiation oncology", "Medical oncology"],
    commonDoseFx: [
      "CSI in selected bridge-to-systemic-therapy scenarios",
      "Symptom-directed RT when focal control is the priority",
    ],
    citations: citations("cns", "manuscript"),
    figures: figures("lmd1", "lmd2"),
    nodes: [
      {
        id: "start",
        prompt: "After LMD is suspected, has the diagnosis been confirmed and are symptoms present?",
        detail: "The first figure is diagnosis-first, then symptom-based.",
        choices: [
          { label: "Symptomatic", next: "symptom-control" },
          { label: "Asymptomatic", next: "bridge-check" },
        ],
      },
      {
        id: "symptom-control",
        prompt: "Are symptoms reasonably controlled after initial symptomatic treatment?",
        detail: "The second figure pivots on symptom control before bridge-to-systemic planning.",
        choices: [
          { label: "Yes, symptoms controlled", next: "bridge-check" },
          { label: "No, symptoms not controlled", next: "no-bridge-check" },
        ],
      },
      {
        id: "bridge-check",
        prompt: "Is the patient being bridged to additional systemic or targeted therapy?",
        detail: "The LMD treatment figure separates bridge-to-systemic candidates from non-bridge pathways.",
        choices: [
          { label: "Yes, bridge to systemic therapy", next: "bridge-outcome" },
          { label: "No, not really a bridge scenario", next: "no-bridge-check" },
        ],
      },
      {
        id: "no-bridge-check",
        prompt: "If not bridging, is performance status poor enough that treatment should stay symptom-only?",
        detail: "The figure explicitly calls out KPS <60 and symptom-only treatment.",
        choices: [
          { label: "KPS < 60 / poor reserve", next: "symptom-only-outcome" },
          { label: "KPS >= 60 / still considering disease-directed care", next: "goc-outcome" },
        ],
      },
      {
        id: "bridge-outcome",
        prompt: "Bridge-to-systemic pathway",
        detail: "CSI plus downstream targeted or IT therapy.",
        outcome: {
          title: "Bridge-to-Systemic-Therapy LMD Path",
          urgency: "Moderate",
          summary:
            "When symptoms are controlled or the patient is asymptomatic and the goal is bridging to systemic therapy, the figure supports considering CSI followed by targeted and/or intrathecal therapy.",
          immediateActions: [
            "Confirm treatment history and actionable genomics",
            "Coordinate symptom control measures such as LP, shunt, medications, or focal RT as needed",
            "Discuss bridge intent clearly with the multidisciplinary team",
          ],
          consults: ["Neuro-oncology", "Medical oncology", "Radiation oncology", "Neurosurgery"],
          rtConsiderations: [
            "Consider CSI in selected bridge scenarios",
            "Integrate RT timing with targeted therapy or intrathecal therapy plans",
          ],
        },
      },
      {
        id: "goc-outcome",
        prompt: "Non-bridge disease-directed pathway",
        detail: "Goals-of-care discussion still allows CSI consideration.",
        outcome: {
          title: "Goals-of-Care-Guided LMD Management",
          urgency: "Moderate",
          summary:
            "If the patient is not clearly bridging to systemic therapy but still has adequate reserve, the figure routes through goals-of-care discussion and selective CSI consideration.",
          immediateActions: [
            "Hold a goals-of-care discussion with patient and primary team",
            "Continue symptom treatment while reassessing disease-directed benefit",
          ],
          consults: ["Neuro-oncology", "Radiation oncology", "Palliative care"],
          rtConsiderations: [
            "Consider CSI selectively if the burden and goals support it",
            "Keep expectations focused on symptom relief and treatment burden",
          ],
        },
      },
      {
        id: "symptom-only-outcome",
        prompt: "Symptom-only pathway",
        detail: "Poor reserve or high burden.",
        outcome: {
          title: "Symptomatic Treatment Only",
          urgency: "Moderate",
          summary:
            "For poor-performance patients, the figure supports staying symptom-directed with shunt, LP, medications, and focal RT only where benefit is clear.",
          immediateActions: [
            "Treat hydrocephalus or pressure symptoms if present",
            "Use steroids, analgesics, and other symptom-directed medications",
            "Consider CSF diversion or LP when appropriate",
          ],
          consults: ["Palliative care", "Neurosurgery", "Radiation oncology as needed"],
          rtConsiderations: [
            "Favor selective symptom-directed RT over broad-field treatment when reserve is poor",
          ],
        },
      },
    ],
  },
  {
    id: "hemoptysis",
    title: "Hemoptysis",
    shortTitle: "Hemoptysis",
    category: "thoracic",
    chiefComplaint:
      "Coughing up blood ranging from blood-streaked sputum to unstable massive hemoptysis.",
    synopsis:
      "Assess stability and bleeding volume first, then localize tumor-associated bleeding and coordinate bronchoscopy before durable RT.",
    redFlags: [
      "Massive hemoptysis",
      "Airway compromise",
      "Hemodynamic instability",
      "Rapidly increasing bleeding volume",
      "Need for transfusion support",
    ],
    workup: [
      "Assess hemodynamic stability and respiratory status",
      "Quantify bleeding volume",
      "CBC, INR if relevant, and contrast chest imaging / CTA",
      "Review anticoagulation and recent central thoracic treatments",
    ],
    defaultConsults: ["Interventional pulmonology", "Critical care", "Radiation oncology"],
    commonDoseFx: ["8 Gy x 1", "20 Gy in 5 fractions", "30 Gy in 10 fractions"],
    citations: citations("thoracicHemoptysis", "manuscript"),
    figures: figures("hemoptysis"),
    nodes: [
      {
        id: "start",
        prompt: "Is this unstable or massive hemoptysis?",
        detail: "The figure separates unstable massive hemoptysis from stable small-volume bleeding immediately.",
        choices: [
          { label: "Yes, unstable / massive", next: "unstable-outcome" },
          { label: "No, stable / smaller volume", next: "tumor-check" },
        ],
      },
      {
        id: "tumor-check",
        prompt: "After workup, is tumor-associated bleeding the likely source?",
        detail: "The stable branch proceeds through workup to tumor-associated bleeding and bronchoscopy coordination.",
        choices: [
          { label: "Yes, tumor-associated bleeding", next: "tumor-outcome" },
          { label: "No / unclear / alternative source likely", next: "alternate-outcome" },
        ],
      },
      {
        id: "unstable-outcome",
        prompt: "Emergent rescue pathway",
        detail: "Airway and hemodynamic stabilization first.",
        outcome: {
          title: "Emergent Non-Radiation Management First",
          urgency: "Critical",
          summary:
            "For unstable or massive hemoptysis, the figure prioritizes transfusion, airway/hemodynamic support, and bronchoscopic intervention before any RT planning.",
          immediateActions: [
            "Stabilize airway and hemodynamics immediately",
            "Transfuse as needed",
            "Coordinate urgent bronchoscopic intervention if possible",
          ],
          consults: ["Critical care", "Interventional pulmonology", "Radiation oncology after stabilization"],
          rtConsiderations: [
            "Do not delay rescue management for simulation",
            "RT becomes a durable-control step after stabilization",
          ],
        },
      },
      {
        id: "tumor-outcome",
        prompt: "Tumor-associated stable hemoptysis pathway",
        detail: "Bronchoscopy coordination then RT.",
        outcome: {
          title: "Bronchoscopy Coordination Then Durable RT",
          urgency: "High",
          summary:
            "For stable tumor-associated hemoptysis, the figure supports bronchoscopy to localize or treat bleeding, then palliative RT for durable control.",
          immediateActions: [
            "Review anticoagulation and transfusion needs",
            "Coordinate bronchoscopy for diagnosis, localization, and local interventions",
            "Obtain contrast chest imaging or CTA",
          ],
          consults: ["Interventional pulmonology", "Radiation oncology"],
          rtConsiderations: [
            "Palliative regimens in the figure include 8 Gy x 1, 20 Gy in 5 fx, and 30 Gy in 10 fx",
            "Expect initial response within 1-5 days and maximal response by around 2 weeks",
          ],
        },
      },
      {
        id: "alternate-outcome",
        prompt: "Alternate-source pathway",
        detail: "Do not anchor on tumor too early.",
        outcome: {
          title: "Clarify Source Before RT",
          urgency: "Moderate",
          summary:
            "If tumor-associated bleeding is not yet clear, finish localization and manage alternative causes before using thoracic RT as the answer.",
          immediateActions: [
            "Complete chest imaging and relevant labs",
            "Review anticoagulation, prior bronchoscopy, and recent therapies such as bevacizumab or central SBRT",
          ],
          consults: ["Interventional pulmonology", "Primary team"],
          rtConsiderations: [
            "Use RT once tumor-associated bleeding is established and the patient is stable enough",
          ],
        },
      },
    ],
  },
  {
    id: "airway-obstruction",
    title: "Malignant Central Airway Obstruction",
    shortTitle: "Airway Obstruction",
    category: "thoracic",
    chiefComplaint:
      "Dyspnea, escalating oxygen needs, chest pain, or post-obstructive pulmonary symptoms.",
    synopsis:
      "Assess respiratory status first, then branch by histology toward urgent bronchoscopy/stenting, chemotherapy, or RT.",
    redFlags: [
      "Respiratory instability",
      "Need for supplemental oxygen",
      "Impending airway failure",
      "Post-obstructive pneumonia with obstruction",
      "Proximal airway compromise",
    ],
    workup: [
      "Respiratory assessment including supplemental oxygen need",
      "CT chest with or without contrast",
      "Pulmonary baseline and cancer history",
      "Biopsy and selected labs if diagnosis is new",
    ],
    defaultConsults: ["Interventional pulmonology", "Medical oncology", "Radiation oncology"],
    commonDoseFx: ["8 Gy x 1", "20 Gy in 5 fractions", "30 Gy in 10 fractions", "17 Gy in 2 weekly fractions"],
    citations: citations("thoracicAirway", "manuscript"),
    figures: figures("airway"),
    nodes: [
      {
        id: "start",
        prompt: "Is the patient unstable from airway compromise right now?",
        detail: "The airway figure makes respiratory stability and oxygen requirement the first fork.",
        choices: [
          { label: "Yes, unstable", next: "unstable-outcome" },
          { label: "No, stable enough for workup", next: "histology-check" },
        ],
      },
      {
        id: "histology-check",
        prompt: "Does the obstructive malignancy look like lymphoma, germ cell tumor, or SCLC?",
        detail: "The figure separates chemo-sensitive histologies from NSCLC/metastatic disease.",
        choices: [
          { label: "Yes, likely lymphoma / germ cell / SCLC", next: "chemo-outcome" },
          { label: "No, more likely NSCLC or metastatic disease", next: "procedural-rt-outcome" },
        ],
      },
      {
        id: "unstable-outcome",
        prompt: "Airway rescue pathway",
        detail: "Urgent procedural intervention first.",
        outcome: {
          title: "Emergent Non-Radiation Airway Management",
          urgency: "Critical",
          summary:
            "For unstable airway obstruction, the figure prioritizes airway management and urgent bronchoscopy with stenting, laser ablation, or endobronchial tumor resection.",
          immediateActions: [
            "Secure the airway and support oxygenation",
            "Coordinate bronchoscopy with stenting, laser ablation, or endobronchial resection",
            "Treat post-obstructive infection if present",
          ],
          consults: ["Interventional pulmonology", "Critical care", "Radiation oncology after stabilization"],
          rtConsiderations: [
            "RT is usually downstream of procedural airway rescue",
            "Response is best when RT is combined with stenting or other intervention",
          ],
        },
      },
      {
        id: "chemo-outcome",
        prompt: "Chemo-sensitive pathway",
        detail: "Histology-first route.",
        outcome: {
          title: "Chemotherapy-Led Initial Management",
          urgency: "High",
          summary:
            "For lymphoma, germ cell tumor, or SCLC, the figure directs initial treatment toward chemotherapy rather than default upfront RT.",
          immediateActions: [
            "Confirm tissue diagnosis rapidly",
            "Assess whether bronchoscopy or stenting is still needed despite chemo sensitivity",
          ],
          consults: ["Medical oncology", "Interventional pulmonology", "Radiation oncology"],
          rtConsiderations: [
            "RT may still be needed later for definitive or palliative consolidation",
          ],
        },
      },
      {
        id: "procedural-rt-outcome",
        prompt: "NSCLC / metastatic pathway",
        detail: "Coordinate interventional pulmonology before RT.",
        outcome: {
          title: "Interventional Pulmonology Coordination Then RT",
          urgency: "High",
          summary:
            "For NSCLC or metastatic obstruction, the figure supports bronchoscopy-based intervention first when needed, followed by palliative or definitive RT depending on stage and goals.",
          immediateActions: [
            "Coordinate with interventional pulmonology for stent placement, laser ablation, or endobronchial resection",
            "Review CT chest and current oxygen requirement",
            "Watch for stent displacement or improved aeration during treatment",
          ],
          consults: ["Interventional pulmonology", "Radiation oncology", "Medical oncology"],
          rtConsiderations: [
            "Palliative EBRT regimens in the figure: 8 Gy x 1, 20 Gy in 5 fx, 30 Gy in 10 fx, 17 Gy in 2 weekly fx",
            "Shorter regimens minimize time in department for unstable patients",
          ],
        },
      },
    ],
  },
  {
    id: "tumor-bleeding",
    title: "Tumor Bleeding",
    shortTitle: "Tumor Bleeding",
    category: "bleeding",
    chiefComplaint:
      "Tumor-associated bleeding from GI, GU, gynecologic, cutaneous, rectal, or nasal sites.",
    synopsis:
      "Stabilize first, confirm the bleed is tumor-related, then route to the fastest site-specific local control option before or alongside RT.",
    redFlags: [
      "Hemodynamic instability",
      "Continuous transfusion need",
      "Brisk bleeding",
      "Rapid hemoglobin drop",
      "Need for immediate local hemostasis",
    ],
    workup: [
      "CBC, CMP, PT/PTT/INR",
      "Medication review including anticoagulation",
      "CT angiography and endoscopy/procedures as indicated",
      "Rule out non-tumor bleeding differentials",
    ],
    defaultConsults: ["IR", "GI / procedural team", "Surgery", "Radiation oncology"],
    commonDoseFx: ["20 Gy in 5 fractions", "30 Gy in 10 fractions", "8 Gy x 1", "12 Gy in 3 fractions", "Quad shot"],
    citations: citations("bleeding", "manuscript"),
    figures: figures("bleeding"),
    nodes: [
      {
        id: "start",
        prompt: "Is the patient unstable or needing ongoing inpatient transfusion-level support?",
        detail: "The figure begins with inpatient vs outpatient/hemodynamic assessment.",
        choices: [
          { label: "Yes, unstable / inpatient level", next: "source-check" },
          { label: "No, outpatient but still concerning", next: "source-check" },
        ],
      },
      {
        id: "source-check",
        prompt: "After workup, is this tumor-associated bleeding?",
        detail: "The figure explicitly routes through non-tumor differential diagnosis before treatment selection.",
        choices: [
          { label: "Yes, tumor-associated", next: "site-check" },
          { label: "No / unclear / likely non-tumor", next: "nontumor-outcome" },
        ],
      },
      {
        id: "site-check",
        prompt: "Which immediate local-control pathway fits best?",
        detail: "Choose the most direct local option from the figure before assuming RT is first.",
        choices: [
          { label: "Cutaneous bleeding", next: "dressings-outcome" },
          { label: "Nasal, vaginal, or rectal bleeding", next: "packing-outcome" },
          { label: "Endoscopically accessible and patient can undergo procedure", next: "endoscopic-outcome" },
          { label: "Brisk bleed with vessel seen on CTA", next: "embolization-outcome" },
          { label: "None of the above / persistent uncontrolled tumor bleeding", next: "rt-outcome" },
        ],
      },
      {
        id: "nontumor-outcome",
        prompt: "Non-tumor differential pathway",
        detail: "Do not anchor on malignancy too early.",
        outcome: {
          title: "Clarify Non-Tumor Bleeding Causes First",
          urgency: "Moderate",
          summary:
            "The figure lists iatrogenic, coagulopathic, infectious, and benign site-specific causes that should be sorted out before reflex tumor-directed RT.",
          immediateActions: [
            "Review medications and interventions",
            "Correct anticoagulation or coagulopathy where appropriate",
            "Pursue site-specific diagnostic workup",
          ],
          consults: ["Primary team", "Relevant procedural service"],
          rtConsiderations: [
            "Reserve RT for confirmed tumor-associated bleeding or after local alternatives fail",
          ],
        },
      },
      {
        id: "dressings-outcome",
        prompt: "Cutaneous local-care pathway",
        detail: "Dressings first.",
        outcome: {
          title: "Dressings and Local Hemostatic Care",
          urgency: "High",
          summary:
            "For cutaneous bleeding, the figure favors non-adherent dressings and local absorbable paste before escalating further.",
          immediateActions: [
            "Use non-adherent dressings",
            "Consider local absorbable hemostatic paste",
            "Escalate if bleeding remains uncontrolled",
          ],
          consults: ["Wound care", "Radiation oncology if bleeding persists"],
          rtConsiderations: [
            "RT remains reasonable if local wound measures do not control tumor bleeding",
          ],
        },
      },
      {
        id: "packing-outcome",
        prompt: "Packing pathway",
        detail: "Rectal, vaginal, and similar sites.",
        outcome: {
          title: "Packing / Local Hemostatic Measures",
          urgency: "High",
          summary:
            "For nasal, vaginal, or rectal bleeding, the figure routes toward packing-based hemostatic control before or alongside RT.",
          immediateActions: [
            "Use packing and local hemostatic agents",
            "For vaginal bleeding, consider formalin-soaked gauze, Monsel solution, or Mohs paste where appropriate",
          ],
          consults: ["Gynecology / site-specific team", "Radiation oncology"],
          rtConsiderations: [
            "Brachytherapy can be considered for vaginal bleeding",
            "EBRT remains an option if local packing is insufficient",
          ],
        },
      },
      {
        id: "endoscopic-outcome",
        prompt: "Endoscopic hemostasis pathway",
        detail: "Procedure-first route.",
        outcome: {
          title: "Endoscopic Treatment First",
          urgency: "High",
          summary:
            "If the tumor is accessible and the patient can tolerate endoscopy, the figure favors cautery, APC, clipping, injection therapy, or laser therapy before defaulting to RT.",
          immediateActions: [
            "Coordinate endoscopic treatment promptly",
            "Monitor if bleeding remains uncontrolled after procedure",
          ],
          consults: ["GI / endoscopy", "Radiation oncology"],
          rtConsiderations: [
            "Move to RT if endoscopic treatment fails or bleeding recurs",
          ],
        },
      },
      {
        id: "embolization-outcome",
        prompt: "CTA-to-embolization pathway",
        detail: "Brisk bleeding route.",
        outcome: {
          title: "IR Embolization for Brisk Bleeding",
          urgency: "Critical",
          summary:
            "When a bleeding vessel is identified on CT angiography, the figure routes to IR embolization with coils or sclerosing agents.",
          immediateActions: [
            "Obtain/confirm CTA localization",
            "Coordinate urgent IR embolization",
            "Continue transfusion and hemodynamic support as needed",
          ],
          consults: ["Interventional radiology", "Radiation oncology"],
          rtConsiderations: [
            "Use RT for downstream durable control if embolization alone is insufficient",
          ],
        },
      },
      {
        id: "rt-outcome",
        prompt: "Radiation treatment pathway",
        detail: "When persistent tumor bleeding still needs durable control.",
        outcome: {
          title: "RT for Persistent Tumor-Associated Bleeding",
          urgency: "Moderate to high",
          summary:
            "If bleeding remains uncontrolled or no faster site-specific option is sufficient, the figure supports RT as a durable local-control option.",
          immediateActions: [
            "Correct anticoagulation and coagulopathy issues where possible",
            "Monitor hemoglobin and transfusion needs closely",
          ],
          consults: ["Radiation oncology", "Relevant procedural services for backup"],
          rtConsiderations: [
            "Figure examples include 20 Gy in 5 fx, 30 Gy in 10 fx, 8 Gy x 1, 12 Gy in 3 fx, and quad shot",
            "Expect initial response within days, maximal response within around 2 weeks, and possible retreatment if rebleeding occurs",
          ],
        },
      },
    ],
  },
  {
    id: "gi-dysphagia",
    title: "Malignant Dysphagia / Esophageal Obstruction",
    shortTitle: "Dysphagia",
    category: "gi",
    chiefComplaint:
      "Trouble swallowing, food getting stuck, regurgitation, aspiration risk, or inability to tolerate PO.",
    synopsis:
      "Determine whether immediate patency intervention is needed, then separate potentially curable disease from metastatic palliative management.",
    redFlags: [
      "Complete PO intolerance",
      "Aspiration risk",
      "Need for urgent stenting",
      "Marked nutritional decline",
      "Need for feeding access",
    ],
    workup: [
      "PO tolerance and nutritional assessment",
      "CT chest with contrast",
      "CBC/CMP and biopsy if diagnosis is new",
      "Review cancer diagnosis and baseline functional status",
    ],
    defaultConsults: ["Interventional GI", "Surgery", "IR", "Radiation oncology"],
    commonDoseFx: ["30 Gy in 10 fractions", "25 Gy in 5 fractions", "36-45 Gy in approximately 3 Gy per fraction"],
    citations: citations("gi", "paradigm"),
    figures: figures("dysphagia"),
    nodes: [
      {
        id: "start",
        prompt: "Is this an unstable esophageal or EGJ obstruction with poor PO status and urgent patency needs?",
        detail: "The figure separates unstable from stable patients based on PO status and nutritional status.",
        choices: [
          { label: "Yes, unstable / urgent obstruction", next: "unstable-outcome" },
          { label: "No, stable enough for complete workup", next: "localized-check" },
        ],
      },
      {
        id: "localized-check",
        prompt: "Does the malignancy still look localized and potentially curable?",
        detail: "The figure distinguishes localized disease from metastatic disease before choosing palliative RT.",
        choices: [
          { label: "Yes, localized / potentially curable", next: "definitive-outcome" },
          { label: "No, metastatic or palliative context", next: "palliative-outcome" },
        ],
      },
      {
        id: "unstable-outcome",
        prompt: "Urgent patency pathway",
        detail: "Non-radiation intervention first.",
        outcome: {
          title: "Urgent Stent / Endoscopic Patency Management",
          urgency: "High",
          summary:
            "For unstable obstruction, the figure prioritizes esophageal stenting and other endoscopic patency interventions before expecting RT to help.",
          immediateActions: [
            "Coordinate esophageal stent or endoscopic intervention",
            "Address nutrition support needs immediately",
            "Assess for aspiration and refeeding concerns",
          ],
          consults: ["Interventional GI", "Surgery", "Nutrition", "Radiation oncology"],
          rtConsiderations: [
            "RT can follow after patency is restored and goals are clarified",
          ],
        },
      },
      {
        id: "definitive-outcome",
        prompt: "Localized disease pathway",
        detail: "Definitive discussion first.",
        outcome: {
          title: "Multidisciplinary Discussion for Definitive Treatment",
          urgency: "Moderate",
          summary:
            "If disease is localized, the figure sends the patient toward multidisciplinary definitive treatment planning rather than reflex palliative RT.",
          immediateActions: [
            "Clarify staging and tissue diagnosis",
            "Coordinate surgery, GI, IR, and medical oncology as needed",
          ],
          consults: ["Medical oncology", "Surgery", "Radiation oncology", "Interventional GI"],
          rtConsiderations: [
            "Avoid short palliative treatment that could complicate later definitive therapy if cure is still on the table",
          ],
        },
      },
      {
        id: "palliative-outcome",
        prompt: "Metastatic/palliative pathway",
        detail: "Patency plus palliative RT.",
        outcome: {
          title: "Patency Support Plus Palliative RT",
          urgency: "Moderate to high",
          summary:
            "For metastatic disease, the figure combines coordination for decompression and patency with palliative RT chosen by desired durability and patient stability.",
          immediateActions: [
            "Coordinate stent placement, ablation, cryotherapy, or endoscopic resection if needed",
            "Monitor for stent displacement and potential refeeding syndrome",
          ],
          consults: ["Interventional GI", "IR", "Surgery", "Radiation oncology"],
          rtConsiderations: [
            "Moderate dosing examples: 30 Gy in 10 fx or 25 Gy in 5 fx",
            "Heavier dosing for more durable palliation: 36-45 Gy in up to 3 Gy per fraction",
          ],
        },
      },
    ],
  },
  {
    id: "gi-bleeding",
    title: "GI Bleeding",
    shortTitle: "GI Bleeding",
    category: "gi",
    chiefComplaint:
      "Hematemesis, hematochezia, melena, anemia, or hypotension from GI tumor bleeding.",
    synopsis:
      "Stabilize hemodynamics, rule in malignancy, then decide between definitive discussion and combined GI/IR/palliative RT management.",
    redFlags: [
      "Hemodynamic instability",
      "Hypotension",
      "Transfusion dependence",
      "Severe anemia",
      "Rapid recurrent bleeding",
    ],
    workup: [
      "CBC and coagulation studies",
      "EGD/colonoscopy if appropriate",
      "CT CAP",
      "Review anticoagulation and comorbidities",
    ],
    defaultConsults: ["Interventional GI", "IR", "Surgery", "Radiation oncology"],
    commonDoseFx: ["30 Gy in 10 fractions", "25 Gy in 5 fractions", "36-39 Gy in 3 Gy fractions for selected esophageal/EGJ/gastric cases"],
    citations: citations("gi", "bleeding"),
    figures: figures("giBleeding"),
    nodes: [
      {
        id: "start",
        prompt: "Is the patient hemodynamically unstable from GI bleeding?",
        detail: "The figure starts with blood pressure and CBC-driven hemodynamic assessment.",
        choices: [
          { label: "Yes, unstable", next: "unstable-outcome" },
          { label: "No, stable enough for full workup", next: "localized-check" },
        ],
      },
      {
        id: "localized-check",
        prompt: "After workup, is this localized and potentially curable or metastatic/palliative?",
        detail: "The figure branches by malignancy status before the RT plan.",
        choices: [
          { label: "Localized / potentially curable", next: "definitive-outcome" },
          { label: "Metastatic / palliative", next: "palliative-outcome" },
        ],
      },
      {
        id: "unstable-outcome",
        prompt: "Initial stabilization pathway",
        detail: "Non-radiation control first.",
        outcome: {
          title: "Urgent Endoscopic / Procedural Stabilization First",
          urgency: "Critical",
          summary:
            "For unstable GI bleeding, the figure prioritizes surgery or endoscopic laser/ablative control before palliative RT is expected to work.",
          immediateActions: [
            "Transfuse and stabilize hemodynamics",
            "Coordinate urgent endoscopy and procedural hemostasis",
            "Clarify upper vs lower source and malignancy involvement",
          ],
          consults: ["Interventional GI", "Surgery", "IR", "Radiation oncology after stabilization"],
          rtConsiderations: [
            "RT becomes the downstream durable-control tool rather than the first rescue step",
          ],
        },
      },
      {
        id: "definitive-outcome",
        prompt: "Localized disease pathway",
        detail: "Potentially curative intent.",
        outcome: {
          title: "Multidisciplinary Definitive-Treatment Discussion",
          urgency: "Moderate",
          summary:
            "If the malignancy is localized, the figure points toward definitive multidisciplinary management instead of immediate palliative RT framing.",
          immediateActions: [
            "Stage the malignancy fully",
            "Coordinate surgery, GI, and oncology planning",
          ],
          consults: ["Medical oncology", "Surgery", "Radiation oncology", "Interventional GI"],
          rtConsiderations: [
            "Keep palliative RT decisions aligned with whether definitive therapy is still planned",
          ],
        },
      },
      {
        id: "palliative-outcome",
        prompt: "Metastatic/palliative pathway",
        detail: "GI/IR coordination plus RT.",
        outcome: {
          title: "GI / IR Coordination Plus Palliative RT",
          urgency: "High",
          summary:
            "For metastatic GI bleeding, the figure supports GI/IR coordination for local control and palliative RT for durable hemostasis.",
          immediateActions: [
            "Coordinate ablation, cryotherapy, or endoscopic resection when useful",
            "Monitor hemodynamic stability and recurrent bleeding closely",
          ],
          consults: ["Interventional GI", "IR", "Radiation oncology"],
          rtConsiderations: [
            "Moderate dosing: 30 Gy in 10 fx or 25 Gy in 5 fx",
            "Heavier dosing examples: 36-39 Gy in 3 Gy fractions for selected esophageal/EGJ/gastric cases",
          ],
        },
      },
    ],
  },
  {
    id: "bowel-obstruction",
    title: "Malignant Bowel Obstruction",
    shortTitle: "Bowel Obstruction",
    category: "gi",
    chiefComplaint:
      "No bowel movements, nausea/vomiting, inability to tolerate PO, or concern for bowel compromise.",
    synopsis:
      "Start with bowel integrity and perforation risk, then separate localized disease from metastatic palliative management.",
    redFlags: [
      "Perforation or bowel integrity concern",
      "Complete obstruction",
      "Rapidly worsening abdominal symptoms",
      "Severe nutritional compromise",
      "Need for urgent NG decompression or surgery",
    ],
    workup: [
      "Assess bowel integrity and nutritional status",
      "CT CAP and consider small bowel series",
      "CBC and coagulation studies",
      "Clarify anticoagulation and cancer history",
    ],
    defaultConsults: ["Surgery", "IR", "Nutrition", "Radiation oncology"],
    commonDoseFx: ["Examples in the figure: 20 Gy in 5 fractions or 30 Gy in 10 fractions"],
    citations: citations("gi", "paradigm"),
    figures: figures("bowel"),
    nodes: [
      {
        id: "start",
        prompt: "Is there instability, perforation risk, or urgent bowel-integrity concern?",
        detail: "The figure begins with bowel integrity/perforation risk and nutritional status.",
        choices: [
          { label: "Yes, unstable / urgent surgical concern", next: "unstable-outcome" },
          { label: "No, stable enough for full workup", next: "localized-check" },
        ],
      },
      {
        id: "localized-check",
        prompt: "Is the malignancy localized and potentially curable or metastatic?",
        detail: "The stable branch moves from workup to malignancy identification and intent.",
        choices: [
          { label: "Localized / potentially curable", next: "definitive-outcome" },
          { label: "Metastatic / palliative", next: "palliative-outcome" },
        ],
      },
      {
        id: "unstable-outcome",
        prompt: "Urgent surgical pathway",
        detail: "Non-radiation emergency management first.",
        outcome: {
          title: "Urgent Surgical / Decompression Management",
          urgency: "Critical",
          summary:
            "For unstable bowel obstruction, the figure prioritizes surgery consultation and acute decompressive management rather than immediate RT.",
          immediateActions: [
            "Coordinate urgent surgical evaluation",
            "Address NG tube decompression and bowel regimen as needed",
            "Support hydration and nutritional status",
          ],
          consults: ["Surgery", "Nutrition", "Primary team"],
          rtConsiderations: [
            "RT is generally a downstream palliative option once acute integrity threats are addressed",
          ],
        },
      },
      {
        id: "definitive-outcome",
        prompt: "Localized disease pathway",
        detail: "Definitive planning first.",
        outcome: {
          title: "Definitive Multidisciplinary Management",
          urgency: "Moderate",
          summary:
            "If malignancy is localized, the figure favors multidisciplinary definitive treatment discussion rather than default palliative RT.",
          immediateActions: [
            "Clarify resectability and staging",
            "Coordinate surgery and oncology planning",
          ],
          consults: ["Surgery", "Medical oncology", "Radiation oncology"],
          rtConsiderations: [
            "Keep palliative RT in reserve if goals shift or decompression remains needed",
          ],
        },
      },
      {
        id: "palliative-outcome",
        prompt: "Metastatic/palliative bowel obstruction pathway",
        detail: "Surgical coordination plus RT examples.",
        outcome: {
          title: "Palliative Coordination With Surgery and RT",
          urgency: "High",
          summary:
            "For metastatic obstruction, the figure supports close cooperation with inpatient and surgical teams, NG decompression, nutritional management, and palliative RT as appropriate.",
          immediateActions: [
            "Coordinate NG tube, possible laparotomy discussions, and nutritional support",
            "Use medical management and inpatient support aggressively",
          ],
          consults: ["Surgery", "Nutrition", "Radiation oncology", "Palliative care"],
          rtConsiderations: [
            "Figure examples include 20 Gy in 5 fx and 30 Gy in 10 fx",
            "Benefit is possible, but the figure notes the prognosis is often generally poor in this population",
          ],
        },
      },
    ],
  },
];

export const categoryLabels: Record<EmergencyFlow["category"], string> = {
  cns: "CNS",
  thoracic: "Thoracic",
  bleeding: "Bleeding",
  gi: "GI",
  general: "General",
};
