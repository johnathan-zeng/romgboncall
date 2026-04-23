import { PhoneGuide } from "../types";

export const phoneGuide: PhoneGuide = {
  id: "phone-calls",
  title: "Phone Call Triage",
  synopsis:
    "A separate after-hours phone-call workflow for HROP-style patient pages: verify the caller, decide whether they need the ED, manage common RT symptoms, and document/pass off clearly.",
  firstSteps: [
    "Confirm the caller is actually looking for Radiation Oncology and is at the site where you are on call.",
    "Read the chart before calling back so you know diagnosis, treatment status, chemo use, and recent notes.",
    "Ask the patient why they are calling even if the page already lists a reason.",
    "Decide early whether the call is about a true oncology issue, a general medical problem, or an immediate emergency.",
  ],
  edTriggers: [
    "ChemoRT patient with fever, chills, or infection symptoms",
    "New shortness of breath, chest pain, pleuritic pain, or inability to protect the airway",
    "Cannot take sufficient PO or cannot keep up with nausea, vomiting, or diarrhea losses",
    "New neurologic symptoms, confusion, worsening headache concerning for increased ICP, or focal deficit",
    "Gross hematuria with retention, symptomatic blood loss, persistent vomiting, SBO concern, or severe dehydration",
    "Thoracic RT patient with shortness of breath, cough, or fever concerning for aspiration or post-obstructive pneumonia",
  ],
  communication: [
    "If sending to an MGB ED, place an ED expect note; if sending elsewhere, call the outside ED.",
    "If you think they need the ED, tell them clearly and document whether they agreed to go.",
    "Email the attending radiation oncologist, the attending on call with you, the medical oncologist, and the relevant resident/NP team.",
    "Enter an EPIC note documenting the phone call.",
    "If unsure, call your attending or another resident early.",
  ],
  nodes: [
    {
      id: "start",
      prompt: "Is this actually the correct Radiation Oncology patient and site?",
      detail:
        "Sometimes the page operator meant Medical Oncology, Radiology, IR, or the other campus.",
      choices: [
        { label: "Yes, correct RO patient/site", next: "emergency-check" },
        { label: "No / unclear", next: "redirect-outcome" },
      ],
    },
    {
      id: "emergency-check",
      prompt: "Does the patient need immediate emergency evaluation?",
      detail:
        "Think fever on chemoRT, chest pain, shortness of breath, inability to take PO, gross bleeding/retention, confusion, or new neurologic symptoms.",
      choices: [
        { label: "Yes, likely ED now", next: "ed-outcome" },
        { label: "No, stable enough to triage further", next: "oncology-check" },
      ],
    },
    {
      id: "oncology-check",
      prompt: "Is the issue actually related to oncology or radiation treatment?",
      detail:
        "Patients sometimes page RO because they know you will answer quickly even when the issue belongs to PCP, cardiology, or another team.",
      choices: [
        { label: "Yes, likely radiation/oncology related", next: "prescription-check" },
        { label: "No, mainly non-oncology", next: "redirect-md-outcome" },
      ],
    },
    {
      id: "prescription-check",
      prompt: "Is this mainly a refill or symptom-medication question?",
      detail:
        "Controlled substances overnight/weekend are a special case and depend on treatment status and Massachusetts location.",
      choices: [
        { label: "Yes, refill / prescription issue", next: "prescription-outcome" },
        { label: "No, symptom triage / advice call", next: "home-outcome" },
      ],
    },
    {
      id: "redirect-outcome",
      prompt: "Redirect pathway",
      detail: "Wrong service or wrong campus.",
      outcome: {
        title: "Redirect the Call First",
        urgency: "Low to moderate",
        summary:
          "If the caller is not actually your Radiation Oncology patient or is paging the wrong campus/service, fix that before you manage the issue.",
        immediateActions: [
          "Confirm the intended team and campus",
          "Redirect the patient or operator to the correct service",
          "If there is any acute neurologic or cardiopulmonary emergency, tell them to call 911 immediately",
        ],
        consults: ["Correct primary service or specialist"],
        rtConsiderations: [
          "Do not anchor on radiation toxicity before confirming the call belongs to your service",
        ],
      },
    },
    {
      id: "ed-outcome",
      prompt: "ED escalation pathway",
      detail: "Clear escalation and documentation.",
      outcome: {
        title: "Send to the ED and Close the Loop",
        urgency: "Critical",
        summary:
          "When the patient needs emergency evaluation, tell them clearly, document whether they agreed, and notify the ED so the story is not lost overnight.",
        immediateActions: [
          "Tell the patient directly that you recommend ED evaluation now",
          "Place an ED expect note for MGB EDs or call the outside ED triage nurse",
          "Document whether the patient agreed to go",
          "If borderline fever on chemoRT, consider repeat temp in 30 minutes only if clinically reasonable and the patient is stable",
        ],
        consults: [
          "ED triage nurse",
          "Attending on call",
          "Relevant oncology teams",
        ],
        rtConsiderations: [
          "Patients on chemoRT with fever, chills, or infection symptoms deserve a low threshold for ED referral",
          "Inability to maintain PO, new neuro deficits, airway issues, SBO concern, or symptomatic bleeding should also push toward ED care",
        ],
      },
    },
    {
      id: "redirect-md-outcome",
      prompt: "Non-oncology pathway",
      detail: "Fast RO access does not make it an RO problem.",
      outcome: {
        title: "Redirect Non-Oncology Issues",
        urgency: "Low to moderate",
        summary:
          "If the question is mainly about blood pressure medications, chronic non-oncology management, or another specialty problem, tell them to contact the relevant physician instead.",
        immediateActions: [
          "Redirect to PCP, cardiology, or the relevant treating team",
          "If the issue suddenly sounds acute despite being non-oncology, tell them to call 911 or go to the ED",
        ],
        consults: ["Relevant outpatient physician or specialty team"],
        rtConsiderations: [
          "One important exception is any acute emergency such as new focal weakness or stroke-like symptoms",
        ],
      },
    },
    {
      id: "prescription-outcome",
      prompt: "Prescription pathway",
      detail: "Controlled substances need extra checks.",
      outcome: {
        title: "Prescription / Refill Triage",
        urgency: "Moderate",
        summary:
          "Short emergency refills can be appropriate for actively treated patients, but controlled substances require Massachusetts location and chart review before prescribing.",
        immediateActions: [
          "Check whether the patient is actively on treatment or recently followed",
          "Review recent rad onc, med onc, or palliative care notes before prescribing",
          "For controlled substances, confirm the patient is physically located in Massachusetts",
          "Only prescribe enough to get through the night or weekend and email the primary prescriber for follow-up",
        ],
        consults: [
          "Primary prescriber",
          "Palliative care or medical oncology when relevant",
        ],
        rtConsiderations: [
          "Patients far removed from treatment or without recent follow-up are usually not appropriate overnight controlled-substance prescriptions from RO",
        ],
      },
    },
    {
      id: "home-outcome",
      prompt: "Home-management pathway",
      detail: "Manage at home with clear return precautions.",
      outcome: {
        title: "Home Management With Strict Callback / ED Precautions",
        urgency: "Moderate",
        summary:
          "If the patient is stable enough to remain at home, give concrete symptom guidance, tell them when to call back, and tell them what symptoms should trigger urgent care.",
        immediateActions: [
          "Review the site-specific symptom guidance below",
          "End the call with explicit return precautions for worsening symptoms",
          "Tell them to seek immediate care for fever, chest pain, shortness of breath, new neuro symptoms, or any other concerning change",
          "Have weekday skin or treatment-field issues looked at the next day when appropriate",
        ],
        consults: [
          "Attending on call as needed",
          "Weekday disease-site team for follow-up",
        ],
        rtConsiderations: [
          "Most calls are about whether the patient can safely stay home overnight or needs escalation now",
        ],
      },
    },
  ],
  sections: [
    {
      title: "Pain Management",
      items: [
        "Escalate stepwise using acetaminophen, NSAIDs, oxycodone/morphine IR, oxycontin/morphine SR, dilaudid, or fentanyl TD as appropriate.",
        "For H&N or thoracic RT, think about liquid formulations or g-tube-compatible medications.",
        "Sometimes patients only need permission to use additional PRN doses within a safe plan.",
      ],
    },
    {
      title: "Non-Mucosal Skin Reactions",
      items: [
        "Use systemic pain control plus Aquaphor or Aveeno and mild soaps.",
        "If it is a weekday, have someone examine the skin the next day; on weekends it can often wait until Monday unless infection is a concern.",
        "For moist desquamation or weeping skin, Silver sulfadiazine 1% cream is reasonable if there is no sulfa allergy.",
        "If cellulitis is a true concern, ask about fever, chills, focal rubor/dolor/calor and consider oral antibiotics or ED referral based on severity.",
      ],
    },
    {
      title: "Mucosal Reactions",
      items: [
        "External genitalia: Aquaphor, 100% aloe vera, or Aquaphor/lidocaine mixture; add sitz baths with Domeboro and a peri-bottle during urination.",
        "Oropharyngeal mucosa: Magic Mouthwash (Maalox:Benadryl:Lidocaine 1:1:1), swish and swallow, ideally 15 minutes before meals.",
        "Radiation esophagitis risk: prophylactic Oramagic (Epic order `K=sorb maltodex-aloe-manpoly mouthwash`) 1 tablespoon QID scheduled, plus PRN MBL magic mouthwash swish and swallow q6h.",
      ],
    },
    {
      title: "GU / GYN / GI",
      items: [
        "Urinary urgency/frequency/burning: consider tamsulosin escalation for prostate patients; NSAIDs can help if infection concern is low and there are no contraindications.",
        "Dysuria may be radiation or UTI; Pyridium often helps. Consider empiric UTI treatment such as ciprofloxacin or TMP-SMX when clinically appropriate.",
        "Hematuria: reassure small self-limited bleeding in-field, but send to ED for gross hematuria, retention, or symptomatic blood loss.",
        "Diarrhea: BRAT-style dietary changes, then Metamucil -> Imodium -> Lomotil -> tincture of opium; if they cannot maintain hydration, send to ED for IV fluids.",
        "Rectal pain or BRBPR: ask about infection/abscess, consider hydrocortisone enema or cream for minor bleeding/pain.",
        "Persistent nausea/vomiting despite antiemetics should trigger review of new narcotics and a lower threshold for ED if hydration or airway protection is threatened.",
      ],
    },
    {
      title: "CNS",
      items: [
        "Headache after brain RT deserves careful questioning, especially whether it is worse lying down or in the morning.",
        "If there is concern for hemorrhage or increased ICP, send the patient to the ED.",
        "For nausea, vomiting, dysequilibrium, or mental-status change, ask about steroids and Temodar; steroid adjustment can be reasonable if the patient recently tapered and you are comfortable with the context.",
        "New neurologic symptoms should go to the ED.",
        "Parotiditis can occur even after one WBRT fraction; consider ibuprofen, acetaminophen, and heat packs.",
      ],
    },
    {
      title: "Thoracic / H&N",
      items: [
        "Shortness of breath, cough, or fever during thoracic RT should have a low threshold for ED referral because of aspiration or post-obstructive pneumonia risk.",
        "For sore throat or dysphagia, use magic mouthwash or viscous lidocaine and think about candidal esophagitis; nystatin or fluconazole can be reasonable if there are no contraindications.",
        "For excess oral secretions, start with guaifenesin products like Robitussin or Mucinex; Levsin can also help. Mucomyst via g-tube can be added if needed.",
        "Avoid Scopolamine patches when possible, especially in older patients sensitive to anticholinergic effects.",
        "For nasal congestion, Alkalol or NeilMed irrigation are reasonable OTC options.",
      ],
    },
    {
      title: "Breast / Treatment-Field Skin",
      items: [
        "Reactions often begin in the third to fourth treatment week, especially with larger breasts.",
        "Gentle care, mild soaps, Aquaphor, aloe, NSAIDs/Tylenol, and Telfa pads for bad inframammary fold reactions are reasonable first steps.",
        "Silvadene can be used for moist desquamation if allergy history allows.",
      ],
    },
    {
      title: "Prescriptions and Massachusetts Rules",
      items: [
        "The patient must be physically located in Massachusetts for you to prescribe controlled substances, even if the pharmacy is elsewhere.",
        "Before prescribing, review palliative care, med onc, or rad onc notes and watch for pain contracts or other prescribing boundaries.",
      ],
    },
    {
      title: "Other Pearls",
      items: [
        "Liver SBRT patients deserve a lower threshold for ED referral for confusion, abdominal pain, or increasing abdominal distension.",
        "If a patient is at risk for pain flare, pretreat with their current pain regimen plus dex before treatment each day when appropriate.",
        "If the patient is going to the ED, calling the triage nurse in advance helps the patient, the ED, and you overnight.",
        "PCP prophylaxis should be considered for steroid courses longer than 30 days.",
      ],
    },
  ],
  tapers: [
    {
      label: "Slow taper",
      schedule: [
        "4 mg twice daily x 4 days",
        "4 mg once daily x 4 days",
        "2 mg once daily x 4 days",
        "1 mg once daily x 4 days",
        "Stop",
      ],
    },
    {
      label: "Moderate taper",
      schedule: [
        "4 mg twice daily x 3 days",
        "4 mg once daily x 3 days",
        "2 mg once daily x 3 days",
        "Stop",
      ],
    },
    {
      label: "Fast taper",
      schedule: [
        "4 mg twice daily x 2 days",
        "4 mg once daily x 2 days",
        "2 mg once daily x 2 days",
        "Stop",
      ],
    },
  ],
};
