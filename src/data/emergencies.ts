import { EmergencyFlow, FlowReference } from "../types";

const referenceLibrary: Record<string, FlowReference> = {
  cnsDeck: {
    id: "cnsDeck",
    title: "ARRO CNS Emergencies",
    citation:
      "Vera A, Dias Neto, Medina A, Freret M. Radiation Oncology On-Call Handbook: CNS emergencies. Association of Residents in Radiation Oncology. December 2025.",
    href: "/references/pptx/ARRO_CNS_Emergencies_121625_sn.pptx",
    format: "pptx",
  },
  thoracicDeck: {
    id: "thoracicDeck",
    title: "ARRO ROCK Thoracic Emergencies",
    citation:
      "Arthur M, Doss VL, Kozono D. Radiation Oncology On-Call Handbook: Hemoptysis and Airway Obstruction. Association of Residents in Radiation Oncology. January 23, 2026.",
    href: "/references/pptx/ARRO_ROCK_ThoracicEmergencies.pptx",
    format: "pptx",
  },
  airwayDeck: {
    id: "airwayDeck",
    title: "ARRO ROCK Airway Obstruction",
    citation:
      "Arthur M, Doss VL, Kozono D. Radiation Oncology On-Call Handbook: Airway Obstruction. Association of Residents in Radiation Oncology. January 23, 2026.",
    href: "/references/pptx/ARRO_ROCK_airway_obstruct_1_27_26.pptx",
    format: "pptx",
  },
  hemoptysisDeck: {
    id: "hemoptysisDeck",
    title: "ARRO ROCK Hemoptysis",
    citation:
      "Arthur M, Doss VL, Kozono D. Radiation Oncology On-Call Handbook: Hemoptysis. Association of Residents in Radiation Oncology. January 23, 2026.",
    href: "/references/pptx/ARRO_ROCK_hemoptysis_1_27_26.pptx",
    format: "pptx",
  },
  bleedingDeck: {
    id: "bleedingDeck",
    title: "ARRO Tumor Bleeding",
    citation:
      "Zhao S, Neibart SS, Turner BE. Radiation Oncology On-Call Handbook: Palliative Radiation for Tumor Bleeding. Association of Residents in Radiation Oncology. September 15, 2025.",
    href: "/references/pptx/ARRO_bleeding_SZ_SN.pptx",
    format: "pptx",
  },
  giDeck: {
    id: "giDeck",
    title: "ARRO GI Emergencies",
    citation:
      "Ho A. Radiation Oncology On-Call Handbook: Gastrointestinal Emergencies. Association of Residents in Radiation Oncology. September 15, 2025.",
    href: "/references/pptx/NEW_GI_OnCall_V3.pptx",
    format: "pptx",
  },
  paradigmDoc: {
    id: "paradigmDoc",
    title: "Palliative RT: General Paradigms and Concepts",
    citation:
      "Ho A. Palliative RT: General Paradigms and Concepts. Peer reviewed by the ARRO Education Subcommittee.",
    href: "/references/docx/General%20Paradigm%20of%20Palliative%20RT%20V2.docx",
    format: "docx",
  },
  manuscriptDoc: {
    id: "manuscriptDoc",
    title: "Inpatient Radiation Oncology and On-Call Emergencies",
    citation:
      "Neibart SS. Inpatient Radiation Oncology and On-Call Emergencies. Department of Radiation Oncology, Mass General Brigham.",
    href: "/references/docx/ROEmergencies_Manuscript_rev1.docx",
    format: "docx",
  },
};

const refs = (...ids: Array<keyof typeof referenceLibrary>) =>
  ids.map((id) => referenceLibrary[id]);

export const emergencyFlows: EmergencyFlow[] = [
  {
    id: "brain-metastases",
    title: "Brain Metastases",
    shortTitle: "Brain Mets",
    category: "cns",
    chiefComplaint:
      "Headache, nausea/vomiting, seizure, focal deficit, vision change, cognitive change.",
    synopsis:
      "Interactive pathway for symptomatic brain metastases with emphasis on steroids, seizure management, neurosurgery triage, and WBRT vs focal options.",
    redFlags: [
      "Seizure activity",
      "Progressive mental status change",
      "Cushing-type signs or concern for elevated ICP",
      "Large lesion with mass effect",
      "Rapid neurologic decline",
    ],
    workup: [
      "Focused neurologic history and full exam",
      "MRI brain with contrast",
      "Systemic staging if no known primary or long disease-free interval",
      "Consider MRI spine if LMD symptoms are present",
    ],
    defaultConsults: [
      "Neurosurgery",
      "Medical oncology / primary oncology team",
      "Radiation oncology",
    ],
    commonDoseFx: [
      "WBRT 30 Gy in 10 fractions",
      "WBRT 20 Gy in 5 fractions for poorer prognosis",
      "SRS considered in limited metastatic disease when clinically appropriate",
    ],
    references: refs("cnsDeck", "manuscriptDoc"),
    nodes: [
      {
        id: "start",
        prompt: "Is the patient actively unstable from intracranial disease?",
        detail:
          "Look for seizure, marked mental status change, uncontrolled vomiting, bradycardia/hypertension pattern, or severe mass-effect symptoms.",
        choices: [
          { label: "Yes, unstable / high ICP concern", next: "unstable" },
          { label: "No, symptomatic but currently stable", next: "stable" },
        ],
      },
      {
        id: "unstable",
        prompt: "Is there a resectable dominant lesion with mass effect in a reasonable surgical candidate?",
        detail:
          "Large lesions, brisk decline, or substantial mass effect often need urgent neurosurgical input before RT.",
        choices: [
          { label: "Yes, likely surgical candidate", next: "surgery-outcome" },
          { label: "No / diffuse disease / not surgical", next: "wbtr-outcome" },
        ],
      },
      {
        id: "stable",
        prompt: "Is disease limited enough that focal therapy may be preferable to upfront WBRT?",
        detail:
          "For limited metastases with acceptable performance status, SRS discussion is typically non-emergent but important.",
        choices: [
          { label: "Yes, limited disease", next: "srs-outcome" },
          { label: "No, diffuse or symptomatic burden favors WBRT", next: "wbtr-outcome" },
        ],
      },
      {
        id: "surgery-outcome",
        prompt: "Immediate stabilization path",
        detail: "Urgent decompression-first approach.",
        outcome: {
          title: "Urgent Neurosurgical Evaluation",
          urgency: "High",
          summary:
            "Prioritize steroids, seizure control if needed, and neurosurgical evaluation for decompression or resection before radiation planning.",
          immediateActions: [
            "Dexamethasone 10 mg IV once, then commonly 4 mg PO/IV q6-12h if not contraindicated",
            "Treat active seizure with benzodiazepine and start maintenance AED if seizure occurred",
            "Obtain/confirm MRI brain with contrast",
            "Discuss pathology goals if diagnosis is not yet established",
          ],
          consults: [
            "Neurosurgery urgently",
            "Medical oncology if new diagnosis or systemic options may rapidly help",
            "Radiation oncology for post-op or non-operative contingency planning",
          ],
          rtConsiderations: [
            "Post-op cavity RT or WBRT depends on disease extent and goals",
            "Emergent WBRT is uncommon when surgery can more rapidly relieve mass effect",
          ],
          notes: [
            "Avoid reflex steroids if primary CNS lymphoma is a serious concern and diagnosis is not established.",
          ],
        },
      },
      {
        id: "wbtr-outcome",
        prompt: "Diffuse symptomatic intracranial disease path",
        detail: "Whole-brain based management.",
        outcome: {
          title: "WBRT-Oriented Management",
          urgency: "Moderate to high",
          summary:
            "Use supportive care and multidisciplinary review, with WBRT favored when symptoms persist despite temporizing measures or disease burden is diffuse.",
          immediateActions: [
            "Steroids for edema / increased ICP symptoms",
            "Antiemetics and supportive care",
            "Trend neurologic exam over the first 48-72 hours",
            "Begin memantine within 3 days of WBRT when appropriate",
          ],
          consults: [
            "Radiation oncology",
            "Neurosurgery if any uncertainty about decompression options",
            "Primary oncology team",
          ],
          rtConsiderations: [
            "Typical dose: 30 Gy in 10 fractions",
            "20 Gy in 5 fractions may be reasonable in poor prognosis situations",
            "HA-WBRT may be considered selectively rather than in truly urgent unstable scenarios",
          ],
        },
      },
      {
        id: "srs-outcome",
        prompt: "Limited intracranial disease path",
        detail: "Focal therapy is often not a same-day emergency.",
        outcome: {
          title: "Focal Therapy / Non-Emergent RT Evaluation",
          urgency: "Moderate",
          summary:
            "For limited symptomatic brain metastases, stabilize medically and evaluate for SRS or focal treatment instead of reflex WBRT.",
          immediateActions: [
            "Start steroids based on symptom burden",
            "Manage seizures if present; no routine AED prophylaxis without seizure",
            "Confirm MRI quality and lesion count",
          ],
          consults: [
            "Radiation oncology",
            "Neurosurgery if lesion size, location, or edema raises surgical questions",
          ],
          rtConsiderations: [
            "SRS dosing depends on lesion size and prior treatment",
            "WBRT remains a fallback if disease burden or symptoms escalate",
          ],
        },
      },
    ],
  },
  {
    id: "spinal-cord-compression",
    title: "Epidural Spinal Cord Compression / Cauda Equina",
    shortTitle: "Cord Compression",
    category: "cns",
    chiefComplaint:
      "Back pain, weakness, numbness, gait change, urinary retention/incontinence, saddle anesthesia, fecal incontinence.",
    synopsis:
      "Decision support around steroids, Bilsky/SINS framing, surgical candidacy, and emergent RT timing for ESCC/CES.",
    redFlags: [
      "Rapidly progressive weakness",
      "Saddle anesthesia",
      "Urinary retention",
      "Mechanical instability pain",
      "Bowel or bladder dysfunction",
    ],
    workup: [
      "Focused neurologic exam including dermatomes and rectal tone when needed",
      "MRI total spine or involved region with contrast",
      "Assess Bilsky ESCC grade and SINS score",
      "Review prior RT history immediately",
    ],
    defaultConsults: [
      "Neurosurgery / spine surgery",
      "Radiation oncology",
      "Medical oncology / inpatient oncology",
    ],
    commonDoseFx: [
      "20-24 Gy in 5-6 fractions",
      "30-36 Gy in 10-12 fractions",
      "8 Gy x 1 usually reserved for pain without neurologic compromise",
    ],
    references: refs("cnsDeck", "manuscriptDoc", "paradigmDoc"),
    nodes: [
      {
        id: "start",
        prompt: "Is there major neurologic deficit, cauda equina syndrome, or imaging suggesting Bilsky 2-3 disease?",
        detail:
          "High-grade ESCC and evolving neurologic compromise usually need urgent decompression assessment.",
        choices: [
          { label: "Yes, high-risk compression", next: "surgical-candidate" },
          { label: "No, lower-grade or slower symptoms", next: "rt-alone-check" },
        ],
      },
      {
        id: "surgical-candidate",
        prompt: "Is the patient an acceptable surgical candidate without prohibitive barriers?",
        detail:
          "Consider performance status, goals of care, disease burden, and expected benefit from decompression/stabilization.",
        choices: [
          { label: "Yes, surgery feasible", next: "surgery-outcome" },
          { label: "No, not a surgical candidate", next: "rt-alone-outcome" },
        ],
      },
      {
        id: "rt-alone-check",
        prompt: "Is there mechanical instability concern by SINS or severe mechanical pain?",
        detail:
          "Instability changes the pathway even if epidural disease itself looks lower grade.",
        choices: [
          { label: "Yes, possible instability", next: "surgery-outcome" },
          { label: "No, likely RT-first candidate", next: "rt-alone-outcome" },
        ],
      },
      {
        id: "surgery-outcome",
        prompt: "Decompression-first path",
        detail: "Surgery usually offers the best chance of neurologic preservation.",
        outcome: {
          title: "Urgent Surgical Decompression / Stabilization Path",
          urgency: "High",
          summary:
            "Start steroids, control pain, and escalate promptly for neurosurgical evaluation because decompression and/or stabilization may provide the best neurologic outcome.",
          immediateActions: [
            "Dexamethasone 10 mg IV once followed by commonly 4 mg q6-12h",
            "Full neurologic exam now and trend closely",
            "Consider Foley if retention is present",
            "Clarify prior RT exposure before any treatment plan is finalized",
          ],
          consults: [
            "Neurosurgery / spine surgery urgently",
            "Radiation oncology for post-op or non-operative backup planning",
          ],
          rtConsiderations: [
            "Adjuvant RT is often needed after decompression",
            "If surgery is delayed or impossible, same-day RT may still become necessary",
          ],
        },
      },
      {
        id: "rt-alone-outcome",
        prompt: "RT-first path",
        detail: "For lower-grade disease or nonsurgical patients.",
        outcome: {
          title: "Urgent RT-First Management",
          urgency: "High",
          summary:
            "For nonsurgical or lower-grade compression, use steroids and closely monitored urgent RT with generous but sensible field design.",
          immediateActions: [
            "Start steroids promptly",
            "Trend exam within hours and daily",
            "Assess pain type: biologic vs mechanical",
            "Review prior radiation records before re-irradiation when possible",
          ],
          consults: [
            "Radiation oncology urgently",
            "Neurosurgery even if ultimate plan is RT alone when instability is uncertain",
          ],
          rtConsiderations: [
            "Common regimens include 20-24 Gy in 5-6 fx or 30-36 Gy in 10-12 fx",
            "Avoid PA-only thoracolumbar fields if treating emergently without CT sim",
            "Reserve 8 Gy x 1 mainly for pain indications without major neurologic deficits",
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
      "Headache, nausea/vomiting, cranial neuropathies, radicular pain, cauda equina symptoms, multifocal deficits.",
    synopsis:
      "A structured path for suspected leptomeningeal disease centered on stabilization, neuroaxis workup, and goals-of-care aligned RT/systemic options.",
    redFlags: [
      "Altered mental status",
      "Signs of elevated ICP",
      "Seizure",
      "Rapidly progressive multifocal deficits",
      "Cauda equina symptoms",
    ],
    workup: [
      "Neuro exam including cranial nerves and cerebellar signs",
      "MRI brain and spine with contrast using dedicated protocols",
      "Consider LP/CSF analysis when safe",
      "Assess systemic disease status and actionable genomics",
    ],
    defaultConsults: [
      "Neuro-oncology",
      "Neurosurgery",
      "Radiation oncology",
    ],
    commonDoseFx: [
      "WBRT or CSI 30 Gy in 10 fractions in selected patients",
      "IFRT to symptomatic sites can be appropriate",
    ],
    references: refs("cnsDeck", "manuscriptDoc"),
    nodes: [
      {
        id: "start",
        prompt: "Is there acute elevated ICP, seizure, or hydrocephalus concern requiring immediate stabilization?",
        detail:
          "These patients often need urgent medical and procedural support before definitive RT decisions.",
        choices: [
          { label: "Yes, unstable", next: "unstable-outcome" },
          { label: "No, stable enough for complete staging", next: "staging" },
        ],
      },
      {
        id: "staging",
        prompt: "Is the patient a candidate for disease-directed therapy after goals-of-care review?",
        detail:
          "LMD management depends heavily on performance status, bulky disease, genomics, and prognosis.",
        choices: [
          { label: "Yes, disease-directed therapy is reasonable", next: "directed-outcome" },
          { label: "No, symptom-focused approach is most appropriate", next: "supportive-outcome" },
        ],
      },
      {
        id: "unstable-outcome",
        prompt: "Stabilization path",
        detail: "Treat the immediate neurologic threat first.",
        outcome: {
          title: "Urgent Stabilization Before RT Selection",
          urgency: "High",
          summary:
            "Manage edema, seizure risk, and hydrocephalus concerns first, then complete multidisciplinary assessment before choosing focal RT, WBRT, CSI, or systemic therapy.",
          immediateActions: [
            "Dexamethasone 10 mg IV then commonly 4 mg q6h",
            "Treat seizures with benzodiazepine then maintenance AED if seizure occurred",
            "Urgent brain imaging and consider neurosurgical CSF diversion discussion",
          ],
          consults: [
            "Neurosurgery",
            "Neuro-oncology",
            "Radiation oncology",
          ],
          rtConsiderations: [
            "Emergent WBRT is uncommon unless symptoms persist and disease burden clearly supports it",
            "Symptomatic-site IFRT may be preferred over broad fields in some patients",
          ],
        },
      },
      {
        id: "directed-outcome",
        prompt: "Disease-directed LMD path",
        detail: "Selected patients can receive active therapy.",
        outcome: {
          title: "Multidisciplinary Disease-Directed Therapy",
          urgency: "Moderate",
          summary:
            "Complete staging, align with goals of care, and individualize among systemic therapy, intrathecal therapy, symptomatic-site RT, WBRT, or CSI.",
          immediateActions: [
            "Complete neuroaxis imaging",
            "Assess CSF studies if safe and useful",
            "Review actionable genomics and treatment history",
          ],
          consults: [
            "Neuro-oncology",
            "Medical oncology",
            "Radiation oncology",
          ],
          rtConsiderations: [
            "CSI or WBRT 30 Gy in 10 fx may be used in selected patients",
            "IFRT to symptomatic bulky or focal sites remains important",
          ],
        },
      },
      {
        id: "supportive-outcome",
        prompt: "Supportive-focused LMD path",
        detail: "When burdens of aggressive therapy outweigh benefit.",
        outcome: {
          title: "Symptom-Focused / Limited RT Approach",
          urgency: "Moderate",
          summary:
            "Use steroids, seizure management, pain support, and carefully selected focal RT only if expected to improve symptoms without causing disproportionate burden.",
          immediateActions: [
            "Clarify goals of care with patient/family and primary team",
            "Use steroids and symptom-directed medications",
            "Consider palliative care involvement early",
          ],
          consults: [
            "Palliative care",
            "Radiation oncology if focal symptom palliation is under consideration",
          ],
          rtConsiderations: [
            "Avoid reflex large-field treatment if benefit is unlikely to be realized",
            "Focal symptomatic-site RT can still be reasonable in select cases",
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
      "Coughing up blood ranging from blood-streaked sputum to massive or rapidly fatal hemorrhage.",
    synopsis:
      "Thoracic bleeding algorithm focused on airway safety, bronchoscopy/interventional triage, and when palliative thoracic RT becomes appropriate.",
    redFlags: [
      "Massive hemoptysis",
      "Inability to clear airway",
      "Hemodynamic instability",
      "Escalating transfusion requirement",
      "Concern for major vessel erosion",
    ],
    workup: [
      "Quantify amount and tempo of bleeding",
      "Assess airway protection and oxygen needs",
      "CBC and relevant coagulation labs",
      "CT chest with contrast or CT angiography",
    ],
    defaultConsults: [
      "Interventional pulmonology",
      "Critical care / airway team",
      "Radiation oncology",
      "Interventional radiology as needed",
    ],
    commonDoseFx: [
      "8 Gy x 1",
      "20 Gy in 5 fractions",
      "30 Gy in 10 fractions",
    ],
    references: refs("hemoptysisDeck", "thoracicDeck", "manuscriptDoc"),
    nodes: [
      {
        id: "start",
        prompt: "Is this massive hemoptysis or otherwise airway/hemodynamically unstable bleeding?",
        detail:
          "Life-threatening hemoptysis is primarily a non-radiation emergency at first presentation.",
        choices: [
          { label: "Yes, unstable / massive", next: "unstable-outcome" },
          { label: "No, smaller volume and relatively stable", next: "stable-path" },
        ],
      },
      {
        id: "stable-path",
        prompt: "Has the bleeding source been localized and acutely stabilized?",
        detail:
          "Bronchoscopy and other interventions often come before RT so the patient can safely proceed to simulation and treatment.",
        choices: [
          { label: "Yes, stabilized", next: "rt-outcome" },
          { label: "No, still needs localization/intervention", next: "procedure-outcome" },
        ],
      },
      {
        id: "unstable-outcome",
        prompt: "Immediate rescue path",
        detail: "Airway and hemorrhage control take priority.",
        outcome: {
          title: "Emergent Airway / Procedural Management First",
          urgency: "Critical",
          summary:
            "Massive hemoptysis should be treated first as an airway and resuscitation emergency. Radiation is not the first stabilizing move.",
          immediateActions: [
            "Activate airway support and consider intubation if airway protection is threatened",
            "Transfuse and resuscitate as needed",
            "Hold/reverse anticoagulation when appropriate",
            "Obtain urgent imaging if it does not delay lifesaving intervention",
          ],
          consults: [
            "Critical care / anesthesia airway team",
            "Interventional pulmonology",
            "Interventional radiology for possible embolization",
          ],
          rtConsiderations: [
            "RT becomes reasonable after acute stabilization for more durable bleeding control",
            "Do not delay urgent non-radiation interventions for simulation",
          ],
        },
      },
      {
        id: "procedure-outcome",
        prompt: "Stabilize before RT path",
        detail: "Localize and temporize the bleed first.",
        outcome: {
          title: "Bronchoscopic / Interventional Localization First",
          urgency: "High",
          summary:
            "When bleeding is ongoing but not yet catastrophic, bronchoscopy and related interventions often establish diagnosis, localize the source, and improve safety before RT.",
          immediateActions: [
            "CT chest with contrast or CT angio",
            "CBC and coagulation review",
            "Coordinate bronchoscopy for localization and local therapy when indicated",
          ],
          consults: [
            "Interventional pulmonology",
            "Radiation oncology",
          ],
          rtConsiderations: [
            "Once stabilized, standard palliative thoracic regimens are reasonable",
            "If disease is potentially curable, avoid compromising definitive planning unnecessarily",
          ],
        },
      },
      {
        id: "rt-outcome",
        prompt: "Durable-control RT path",
        detail: "RT after stabilization.",
        outcome: {
          title: "Palliative Thoracic RT for Durable Bleeding Control",
          urgency: "Moderate to high",
          summary:
            "After airway and hemodynamic stabilization, thoracic RT can reduce recurrent tumor-related bleeding risk over days to weeks.",
          immediateActions: [
            "Confirm bleeding is tumor-related and sufficiently stabilized to simulate",
            "Review prior thoracic RT and risk factors such as central SBRT or bevacizumab exposure",
          ],
          consults: [
            "Radiation oncology",
            "Interventional pulmonology if source control remains fragile",
          ],
          rtConsiderations: [
            "Common regimens: 8 Gy x 1, 20 Gy in 5 fx, 30 Gy in 10 fx",
            "Aggressive combined-modality approaches may be used selectively",
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
      "Dyspnea, stridor, wheeze, oxygen need, chest discomfort, post-obstructive symptoms.",
    synopsis:
      "Interactive pathway for malignant airway obstruction centered on respiratory stability, bronchoscopy/stenting, and RT as a consolidative or palliative step.",
    redFlags: [
      "Respiratory distress",
      "Need for escalating oxygen",
      "Stridor",
      "Impending respiratory failure",
      "Complete or near-complete central airway narrowing",
    ],
    workup: [
      "Assess current respiratory status and need for airway protection",
      "CT chest with contrast",
      "Review baseline pulmonary reserve and comorbidities",
      "If new diagnosis, coordinate biopsy and selected labs",
    ],
    defaultConsults: [
      "Interventional pulmonology",
      "Critical care / anesthesia if tenuous",
      "Radiation oncology",
      "Medical oncology",
    ],
    commonDoseFx: [
      "8 Gy x 1",
      "20 Gy in 5 fractions",
      "30 Gy in 10 fractions",
      "17 Gy in 2 fractions once weekly",
    ],
    references: refs("airwayDeck", "thoracicDeck", "manuscriptDoc"),
    nodes: [
      {
        id: "start",
        prompt: "Is the respiratory status unstable right now?",
        detail:
          "If the patient is tenuous, procedural airway management usually works faster than external beam RT.",
        choices: [
          { label: "Yes, unstable", next: "unstable-outcome" },
          { label: "No, stable enough for broader planning", next: "histology-check" },
        ],
      },
      {
        id: "histology-check",
        prompt: "Is histology one where systemic therapy may be the best initial tumor-directed move?",
        detail:
          "Examples include lymphoma, germ cell tumor, and SCLC in the right clinical context.",
        choices: [
          { label: "Yes, chemo-sensitive histology likely", next: "systemic-outcome" },
          { label: "No / unclear / local palliation needed", next: "rt-outcome" },
        ],
      },
      {
        id: "unstable-outcome",
        prompt: "Urgent procedural path",
        detail: "Stent, debulk, ablate, or secure the airway first.",
        outcome: {
          title: "Airway Intervention Before RT",
          urgency: "Critical",
          summary:
            "Patients with unstable malignant airway obstruction usually need immediate airway-focused intervention before considering RT.",
          immediateActions: [
            "Support oxygenation and escalate airway management",
            "Urgent bronchoscopy evaluation for stent, debulking, or laser/ablative therapy",
            "CT chest if it does not delay airway rescue",
          ],
          consults: [
            "Interventional pulmonology urgently",
            "Critical care / anesthesia",
            "Radiation oncology for post-stabilization planning",
          ],
          rtConsiderations: [
            "RT is often most useful after the airway is opened to reduce re-obstruction risk",
            "If elective intubation is needed to safely simulate, coordinate before transport",
          ],
        },
      },
      {
        id: "systemic-outcome",
        prompt: "Chemo-sensitive pathway",
        detail: "Not every airway tumor should go straight to RT.",
        outcome: {
          title: "Systemic Therapy-Led Multidisciplinary Path",
          urgency: "Moderate to high",
          summary:
            "For selected histologies such as lymphoma, germ cell tumor, or SCLC, systemic therapy may offer the most effective initial tumor response, with RT used selectively.",
          immediateActions: [
            "Secure tissue diagnosis if not established",
            "Review whether any procedural airway intervention is still needed despite chemo sensitivity",
          ],
          consults: [
            "Medical oncology",
            "Interventional pulmonology",
            "Radiation oncology",
          ],
          rtConsiderations: [
            "Definitive or palliative RT may still be needed depending on stage and response",
          ],
        },
      },
      {
        id: "rt-outcome",
        prompt: "RT-inclusive airway path",
        detail: "Stable enough for simulation and treatment.",
        outcome: {
          title: "Palliative or Definitive RT After Airway Assessment",
          urgency: "Moderate to high",
          summary:
            "When the patient is stable enough and local disease control is needed, RT can be used after or alongside interventional planning for longer-term control.",
          immediateActions: [
            "Confirm respiratory stability for CT simulation",
            "Coordinate with pulmonology if stenting or debulking could improve safety or efficacy first",
          ],
          consults: [
            "Radiation oncology",
            "Interventional pulmonology",
            "Medical oncology if newly diagnosed or potentially definitive",
          ],
          rtConsiderations: [
            "Palliative regimens include 8 Gy x 1, 20 Gy in 5 fx, 30 Gy in 10 fx, or 17 Gy in 2 weekly fx",
            "Monitor for stent position changes and aeration changes during treatment",
          ],
        },
      },
    ],
  },
  {
    id: "tumor-bleeding",
    title: "Abdominal / Pelvic Tumor Bleeding",
    shortTitle: "Tumor Bleeding",
    category: "bleeding",
    chiefComplaint:
      "Hematemesis, hematochezia, melena, hematuria, vaginal bleeding, or occult tumor-associated anemia.",
    synopsis:
      "Algorithm for tumor-related bleeding across GI/GU/gynecologic sites with emphasis on stabilization, source control, and palliative RT timing.",
    redFlags: [
      "Hemodynamic instability",
      "Continuous transfusion need",
      "Rapid hemoglobin drop",
      "Active brisk bleeding requiring packing or tamponade",
    ],
    workup: [
      "CBC and coagulation studies",
      "Site-directed exam where useful",
      "CT angiography or cross-sectional imaging when embolization is being considered",
      "Endoscopy, cystoscopy, or gynecologic exam as indicated",
    ],
    defaultConsults: [
      "Relevant procedural team: GI, IR, urology, gynecologic oncology, surgery",
      "Radiation oncology",
    ],
    commonDoseFx: [
      "20 Gy in 5 fractions",
      "30 Gy in 10 fractions",
      "8 Gy x 1 in selected settings",
      "Hypofractionation preferred in many gynecologic bleeding scenarios",
    ],
    references: refs("bleedingDeck", "manuscriptDoc", "giDeck"),
    nodes: [
      {
        id: "start",
        prompt: "Is the patient hemodynamically unstable or continuously transfusion dependent?",
        detail:
          "If yes, acute stabilization and local hemostasis come before expecting RT to work.",
        choices: [
          { label: "Yes, unstable", next: "unstable-outcome" },
          { label: "No, stabilized / lower acuity", next: "source-control-check" },
        ],
      },
      {
        id: "source-control-check",
        prompt: "Is there a procedural option likely to provide faster local hemostasis?",
        detail:
          "Embolization, endoscopic cautery, packing, tamponade, stenting, or surgery may bridge to RT.",
        choices: [
          { label: "Yes, likely procedural bridge", next: "procedure-outcome" },
          { label: "No, RT can be primary local palliation", next: "rt-outcome" },
        ],
      },
      {
        id: "unstable-outcome",
        prompt: "Immediate rescue path",
        detail: "Stabilize and localize the bleeding first.",
        outcome: {
          title: "Resuscitation and Local Hemostasis First",
          urgency: "Critical",
          summary:
            "Tumor bleeding rarely behaves like an RT-only emergency in the first minutes to hours. Resuscitation and procedural hemostasis usually come first.",
          immediateActions: [
            "Transfuse and correct coagulopathy",
            "Hold anticoagulation when clinically feasible",
            "Use local hemostatic measures such as packing or tamponade when applicable",
            "Identify bleeding source with imaging and/or endoscopy",
          ],
          consults: [
            "IR / endoscopy / surgery / specialty service based on source",
            "Radiation oncology for downstream durable control planning",
          ],
          rtConsiderations: [
            "RT response may take days to weeks",
            "Do not overpromise immediate bleeding cessation from the first fractions",
          ],
        },
      },
      {
        id: "procedure-outcome",
        prompt: "Bridge-to-RT path",
        detail: "Fastest intervention first, then durable control.",
        outcome: {
          title: "Procedure First, Then Consider RT for Durability",
          urgency: "High",
          summary:
            "When a faster procedural hemostatic option exists, use it to stabilize the patient and consider RT afterward to reduce recurrent tumor bleeding.",
          immediateActions: [
            "Coordinate endoscopic, IR, urologic, gynecologic, or surgical intervention",
            "Trend CBC and transfusion requirement",
          ],
          consults: [
            "Relevant procedural service",
            "Radiation oncology",
          ],
          rtConsiderations: [
            "Common palliative regimens include 20 Gy in 5 fx or 30 Gy in 10 fx",
            "Shorter regimens may be useful when prognosis is limited or definitive treatment remains possible later",
          ],
        },
      },
      {
        id: "rt-outcome",
        prompt: "RT-primary palliation path",
        detail: "When bleeding is tumor related and the patient is stable enough to proceed.",
        outcome: {
          title: "Palliative RT for Tumor Bleeding",
          urgency: "Moderate to high",
          summary:
            "For stabilized tumor-associated bleeding without a superior rapid procedural option, palliative RT is a reasonable route to durable symptom control.",
          immediateActions: [
            "Confirm source and disease extent",
            "Clarify whether future definitive therapy remains on the table before choosing dose/fractionation",
          ],
          consults: [
            "Radiation oncology",
            "Site-specific team if any doubt about additional hemostatic options",
          ],
          rtConsiderations: [
            "GI bleeding: 20 Gy in 5 fx or 30 Gy in 10 fx are common",
            "Gynecologic bleeding often favors hypofractionation",
            "8 Gy x 1 can provide brisk palliation but may require retreatment",
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
      "Difficulty swallowing, regurgitation, aspiration risk, inability to tolerate oral intake.",
    synopsis:
      "GI obstruction pathway focusing on patency, nutrition, stenting, and when inpatient or outpatient RT makes sense.",
    redFlags: [
      "Complete inability to take PO",
      "Aspiration risk",
      "Severe malnutrition / dehydration",
      "Need for urgent feeding access",
    ],
    workup: [
      "History focused on obstruction severity and aspiration",
      "CBC/CMP/coagulation panel",
      "CT chest with contrast",
      "EGD for visualization and intervention",
    ],
    defaultConsults: [
      "Surgery",
      "Interventional GI",
      "Nutrition",
      "Radiation oncology",
    ],
    commonDoseFx: [
      "20 Gy in 5 fractions",
      "25 Gy in 5 fractions",
      "30 Gy in 10 fractions",
      "Higher-dose conventional regimens when more durable control is needed",
    ],
    references: refs("giDeck", "paradigmDoc"),
    nodes: [
      {
        id: "start",
        prompt: "Is there acute complete obstruction or inability to safely take PO?",
        detail:
          "If yes, priority is restoring patency and nutrition rather than expecting immediate RT effect.",
        choices: [
          { label: "Yes, acute obstruction", next: "intervention-outcome" },
          { label: "No, partial / non-acute obstruction", next: "intent-check" },
        ],
      },
      {
        id: "intent-check",
        prompt: "Is definitive-intent multidisciplinary therapy still plausible?",
        detail:
          "This matters because a short palliative course can complicate later definitive chemoradiation planning.",
        choices: [
          { label: "Yes, potentially definitive", next: "definitive-outcome" },
          { label: "No, palliative focus", next: "palliative-outcome" },
        ],
      },
      {
        id: "intervention-outcome",
        prompt: "Restore patency first",
        detail: "Bridge the patient through the acute obstruction.",
        outcome: {
          title: "Procedural Patency and Nutrition First",
          urgency: "High",
          summary:
            "Acute malignant dysphagia usually needs rapid non-radiation intervention first, such as stenting or feeding support, because RT acts over days to weeks.",
          immediateActions: [
            "Assess aspiration risk and hydration",
            "Coordinate EGD and consider stenting or local intervention",
            "Address nutrition with feeding access or TPN when needed",
          ],
          consults: [
            "Interventional GI",
            "Surgery",
            "Nutrition",
            "Radiation oncology",
          ],
          rtConsiderations: [
            "RT can follow once the patient is stabilized and goals are clear",
          ],
        },
      },
      {
        id: "definitive-outcome",
        prompt: "Potentially curative path",
        detail: "Avoid compromising later definitive treatment.",
        outcome: {
          title: "Definitive-Therapy Aware Planning",
          urgency: "Moderate",
          summary:
            "If the patient may still receive definitive treatment, coordinate closely before choosing any palliative RT so later planning is not unnecessarily complicated.",
          immediateActions: [
            "Clarify stage, performance status, and systemic plan",
            "Review whether short bridging intervention is better than immediate palliative RT",
          ],
          consults: [
            "Medical oncology",
            "Surgery",
            "Radiation oncology",
          ],
          rtConsiderations: [
            "Conventional fractionation with or without chemotherapy may be preferred over short palliative courses",
          ],
        },
      },
      {
        id: "palliative-outcome",
        prompt: "Palliative dysphagia RT path",
        detail: "When durable symptom relief is the main goal.",
        outcome: {
          title: "Palliative RT for Dysphagia",
          urgency: "Moderate",
          summary:
            "For non-acute obstruction after stabilization, RT can improve dysphagia over time and may be delivered inpatient or outpatient depending on symptom burden.",
          immediateActions: [
            "Assess nutritional reserve and current oral tolerance",
            "Coordinate with GI if stenting may still speed relief",
          ],
          consults: [
            "Radiation oncology",
            "Interventional GI as needed",
          ],
          rtConsiderations: [
            "Regimens commonly range from 20 Gy in 5 fx to 30 Gy in 10 fx, with higher-dose regimens for more durable palliation",
          ],
        },
      },
    ],
  },
  {
    id: "gi-bleeding",
    title: "Gastrointestinal Tumor Bleeding",
    shortTitle: "GI Bleeding",
    category: "gi",
    chiefComplaint:
      "Hematemesis, melena, hematochezia, anemia, or hypotension from GI tract tumor bleeding.",
    synopsis:
      "GI-focused bleeding flow with source localization, endoscopic/IR bridge options, and palliative RT choices.",
    redFlags: [
      "Hypotension",
      "Hgb < 7 or fast downtrend",
      "Active large-volume hematemesis or hematochezia",
      "Transfusion dependence",
    ],
    workup: [
      "Determine upper vs lower GI source from symptoms",
      "CBC and coagulation studies",
      "CT CAP with contrast",
      "EGD and/or colonoscopy as appropriate",
    ],
    defaultConsults: [
      "Interventional GI",
      "Surgery / colorectal / thoracic depending on site",
      "IR",
      "Radiation oncology",
    ],
    commonDoseFx: [
      "20 Gy in 5 fractions",
      "25 Gy in 5 fractions",
      "30 Gy in 10 fractions",
      "36-39 Gy in 3 Gy per fraction for selected esophageal/gastric cases",
    ],
    references: refs("giDeck", "bleedingDeck"),
    nodes: [
      {
        id: "start",
        prompt: "Is the patient hypotensive or requiring ongoing transfusions?",
        detail: "Stabilization and source control come first.",
        choices: [
          { label: "Yes", next: "unstable-outcome" },
          { label: "No", next: "intervention-check" },
        ],
      },
      {
        id: "intervention-check",
        prompt: "Is endoscopic or IR hemostasis available and likely to work quickly?",
        detail: "Use the fastest effective bridge when available.",
        choices: [
          { label: "Yes", next: "bridge-outcome" },
          { label: "No", next: "rt-outcome" },
        ],
      },
      {
        id: "unstable-outcome",
        prompt: "Resuscitation path",
        detail: "Immediate supportive and procedural care.",
        outcome: {
          title: "GI Bleeding Rescue Path",
          urgency: "Critical",
          summary:
            "For unstable GI bleeding, prioritize transfusion, localization, and endoscopic/IR/surgical intervention before relying on RT.",
          immediateActions: [
            "Resuscitate and transfuse",
            "Localize source with symptoms, imaging, and endoscopy",
            "Correct coagulopathy and review anticoagulants",
          ],
          consults: [
            "Interventional GI",
            "Surgery and/or IR",
            "Radiation oncology once stabilized",
          ],
          rtConsiderations: [
            "RT is generally a downstream durable-control tool, not the first rescue move",
          ],
        },
      },
      {
        id: "bridge-outcome",
        prompt: "Bridge first path",
        detail: "Procedure before RT.",
        outcome: {
          title: "Endoscopic / IR Bridge Before RT",
          urgency: "High",
          summary:
            "Use a procedural bridge for faster hemostasis when available, then consider RT for recurrence prevention or durable tumor control.",
          immediateActions: [
            "Coordinate endoscopy or embolization",
            "Trend CBC and transfusion needs",
          ],
          consults: [
            "Interventional GI",
            "IR",
            "Radiation oncology",
          ],
          rtConsiderations: [
            "20 Gy in 5 fx or 30 Gy in 10 fx are common palliative options",
          ],
        },
      },
      {
        id: "rt-outcome",
        prompt: "RT-driven GI bleeding path",
        detail: "For stabilized patients where RT is the best local option.",
        outcome: {
          title: "Palliative RT for GI Bleeding",
          urgency: "Moderate",
          summary:
            "In stabilized GI tumor bleeding without a superior acute intervention, RT can provide meaningful hemostatic benefit over days to weeks.",
          immediateActions: [
            "Confirm site and disease extent",
            "Review prior GI/pelvic RT if relevant",
          ],
          consults: [
            "Radiation oncology",
            "GI / surgery as needed",
          ],
          rtConsiderations: [
            "20 Gy in 5 fx, 25 Gy in 5 fx, or 30 Gy in 10 fx are common approaches",
            "Site-specific escalation can be considered for esophageal or gastric tumors",
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
