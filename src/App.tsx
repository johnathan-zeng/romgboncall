import { useMemo, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { categoryLabels, emergencyFlows } from "./data/emergencies";
import { phoneGuide } from "./data/phoneCalls";
import { EmergencyFlow, FlowFigure, FlowNode, PhoneGuide, QuickSection, TaperPlan } from "./types";

const flowMap = new Map(emergencyFlows.map((flow) => [flow.id, flow]));
const LAST_UPDATED = "April 23, 2026";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/emergency/:flowId" element={<EmergencyPage />} />
      <Route path="/phone-calls" element={<PhonePage />} />
    </Routes>
  );
}

function HomePage() {
  const [query, setQuery] = useState("");
  const flows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return emergencyFlows;
    }

    return emergencyFlows.filter((flow) =>
      [
        flow.title,
        flow.shortTitle,
        flow.category,
        flow.chiefComplaint,
        flow.synopsis,
        flow.redFlags.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  return (
    <div className="shell">
      <Hero />
      <section className="search-panel">
        <label className="search-label" htmlFor="search">
          Search emergencies, symptoms, or topics
        </label>
        <input
          id="search"
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try hemoptysis, brain metastasis, LMD, bowel obstruction..."
        />
      </section>

      <section className="feature-grid">
        <Link to="/phone-calls" className="flow-card feature-card">
          <div className="flow-card-top">
            <span className="tag tag-general">Phone Calls</span>
            <span className="flow-card-arrow">Open</span>
          </div>
          <h2>{phoneGuide.title}</h2>
          <p>{phoneGuide.synopsis}</p>
          <div className="meta-block">
            <strong>Focus</strong>
            <span>After-hours patient calls, ED triage, symptom advice, prescriptions, and handoff.</span>
          </div>
        </Link>
      </section>

      <section className="card-grid">
        {flows.map((flow) => (
          <Link key={flow.id} to={`/emergency/${flow.id}`} className="flow-card">
            <div className="flow-card-top">
              <span className={`tag tag-${flow.category}`}>
                {categoryLabels[flow.category]}
              </span>
              <span className="flow-card-arrow">Open</span>
            </div>
            <h2>{flow.title}</h2>
            <p>{flow.synopsis}</p>
            <div className="meta-block">
              <strong>Chief complaint</strong>
              <span>{flow.chiefComplaint}</span>
            </div>
          </Link>
        ))}
      </section>

      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <header className="hero">
      <div className="hero-copy">
        <div className="eyebrow">Radiation Oncology On-Call</div>
        <h1>RO Call Pathways</h1>
        <p>
          Use the emergency algorithms for acute oncologic scenarios and the phone-call guide
          for after-hours patient triage, symptom management, and escalation decisions.
        </p>
      </div>
    </header>
  );
}

function EmergencyPage() {
  const { flowId } = useParams();
  const flow = flowId ? flowMap.get(flowId) : undefined;
  const [activeFigure, setActiveFigure] = useState<FlowFigure | null>(null);

  if (!flow) {
    return (
      <div className="shell narrow">
        <p>Emergency pathway not found.</p>
        <Link to="/" className="button-link">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <div className="shell detail-shell">
      <nav className="detail-nav">
        <Link to="/" className="button-link subtle">
          All pathways
        </Link>
      </nav>

      <section className="detail-header">
        <div>
          <span className={`tag tag-${flow.category}`}>
            {categoryLabels[flow.category]}
          </span>
          <h1>{flow.title}</h1>
          <p>{flow.chiefComplaint}</p>
        </div>
        <div className="header-summary">
          <div>
            <strong>Source Basis</strong>
            <CitationList flow={flow} />
          </div>
        </div>
      </section>

      <section className="figure-strip">
        {flow.figures.map((figure) => (
          <button
            key={figure.id}
            className="figure-card"
            onClick={() => setActiveFigure(figure)}
          >
            <img src={figure.src} alt={figure.title} />
            <div>
              <strong>{figure.title}</strong>
              <span>{figure.caption}</span>
            </div>
          </button>
        ))}
      </section>

      <section className="detail-grid">
        <aside className="info-panel">
          <Panel title="Red Flags" items={flow.redFlags} />
          <Panel title="Core Workup" items={flow.workup} />
          <Panel title="Default Consults" items={flow.defaultConsults} />
          <Panel title="Common Dose / Fx" items={flow.commonDoseFx} />
        </aside>
        <FlowExplorer flow={flow} />
      </section>

      {activeFigure ? (
        <FigureModal figure={activeFigure} onClose={() => setActiveFigure(null)} />
      ) : null}

      <Footer />
    </div>
  );
}

function PhonePage() {
  const [selectedSectionTitle, setSelectedSectionTitle] = useState(phoneGuide.sections[0]?.title ?? "");
  const selectedSection =
    phoneGuide.sections.find((section) => section.title === selectedSectionTitle) ??
    phoneGuide.sections[0];

  return (
    <div className="shell detail-shell">
      <nav className="detail-nav">
        <Link to="/" className="button-link subtle">
          All pathways
        </Link>
      </nav>

      <section className="detail-header">
        <div>
          <span className="tag tag-general">Phone Calls</span>
          <h1>{phoneGuide.title}</h1>
          <p>{phoneGuide.synopsis}</p>
        </div>
        <div className="header-summary">
          <div>
            <strong>HROP priorities</strong>
            <PlainListCard items={phoneGuide.firstSteps} />
          </div>
        </div>
      </section>

      <section className="detail-grid">
        <aside className="info-panel">
          <Panel title="First Steps" items={phoneGuide.firstSteps} />
          <Panel title="Send To ED If" items={phoneGuide.edTriggers} />
          <Panel title="Communication / Pass-off" items={phoneGuide.communication} />
        </aside>
        <PhoneExplorer guide={phoneGuide} />
      </section>

      <section className="taper-panel">
        <div className="taper-header">
          <div className="eyebrow">Problem Picker</div>
          <h2>Jump to a common phone-call problem</h2>
        </div>
        <div className="problem-picker">
          <label className="search-label" htmlFor="phone-problem-select">
            Select a symptom or management area
          </label>
          <select
            id="phone-problem-select"
            className="search-input"
            value={selectedSectionTitle}
            onChange={(event) => setSelectedSectionTitle(event.target.value)}
          >
            {phoneGuide.sections.map((section) => (
              <option key={section.title} value={section.title}>
                {section.title}
              </option>
            ))}
          </select>
        </div>
        {selectedSection ? <QuickSectionCard section={selectedSection} /> : null}
      </section>

      <section className="phone-section-grid">
        {phoneGuide.sections.map((section) => (
          <QuickSectionCard key={section.title} section={section} />
        ))}
      </section>

      <section className="taper-panel">
        <div className="taper-header">
          <div className="eyebrow">Dex Taper</div>
          <h2>Dexamethasone taper quick reference</h2>
        </div>
        <div className="taper-grid">
          {phoneGuide.tapers.map((taper) => (
            <TaperCard key={taper.label} taper={taper} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CitationList({ flow }: { flow: EmergencyFlow }) {
  return (
    <div className="citation-list">
      {flow.citations.map((citation) => (
        <div key={citation.id} className="citation-card">
          <strong>{citation.title}</strong>
          <span>{citation.citation}</span>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function PlainListCard({ items }: { items: string[] }) {
  return (
    <div className="citation-list">
      <div className="citation-card">
        <ul className="plain-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FlowExplorer({ flow }: { flow: EmergencyFlow }) {
  const [path, setPath] = useState<string[]>(["start"]);
  const currentNode = getCurrentNode(flow, path);
  const visitedNodes = path
    .map((id) => flow.nodes.find((node) => node.id === id))
    .filter(Boolean) as FlowNode[];

  const reset = () => setPath(["start"]);
  const undo = () =>
    setPath((current) => (current.length > 1 ? current.slice(0, -1) : current));

  return (
    <section className="explorer">
      <div className="explorer-header">
        <div>
          <div className="eyebrow">Interactive pathway</div>
          <h2>{currentNode.prompt}</h2>
          <p>{currentNode.detail}</p>
        </div>
        <div className="explorer-actions">
          <button
            className="reset-button secondary-button"
            onClick={undo}
            disabled={path.length === 1}
          >
            Back
          </button>
          <button className="reset-button" onClick={reset}>
            Reset flow
          </button>
        </div>
      </div>

      <div className="pathway">
        {visitedNodes.map((node, index) => (
          <div key={`${node.id}-${index}`} className="path-step">
            <span className="path-index">{index + 1}</span>
            <div>
              <strong>{node.prompt}</strong>
              <p>{node.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {currentNode.outcome ? (
        <OutcomeCard node={currentNode} />
      ) : (
        <div className="choice-grid">
          {currentNode.choices?.map((choice) => (
            <button
              key={choice.label}
              className="choice-card"
              onClick={() => setPath((current) => [...current, choice.next])}
            >
              <strong>{choice.label}</strong>
              {choice.detail ? <span>{choice.detail}</span> : null}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function PhoneExplorer({ guide }: { guide: PhoneGuide }) {
  const [path, setPath] = useState<string[]>(["start"]);
  const currentNode = getCurrentNode(guide, path);
  const visitedNodes = path
    .map((id) => guide.nodes.find((node) => node.id === id))
    .filter(Boolean) as FlowNode[];

  const reset = () => setPath(["start"]);
  const undo = () =>
    setPath((current) => (current.length > 1 ? current.slice(0, -1) : current));

  return (
    <section className="explorer">
      <div className="explorer-header">
        <div>
          <div className="eyebrow">Phone triage flow</div>
          <h2>{currentNode.prompt}</h2>
          <p>{currentNode.detail}</p>
        </div>
        <div className="explorer-actions">
          <button
            className="reset-button secondary-button"
            onClick={undo}
            disabled={path.length === 1}
          >
            Back
          </button>
          <button className="reset-button" onClick={reset}>
            Reset flow
          </button>
        </div>
      </div>

      <div className="pathway">
        {visitedNodes.map((node, index) => (
          <div key={`${node.id}-${index}`} className="path-step">
            <span className="path-index">{index + 1}</span>
            <div>
              <strong>{node.prompt}</strong>
              <p>{node.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {currentNode.outcome ? (
        <OutcomeCard node={currentNode} />
      ) : (
        <div className="choice-grid">
          {currentNode.choices?.map((choice) => (
            <button
              key={choice.label}
              className="choice-card"
              onClick={() => setPath((current) => [...current, choice.next])}
            >
              <strong>{choice.label}</strong>
              {choice.detail ? <span>{choice.detail}</span> : null}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function OutcomeCard({ node }: { node: FlowNode }) {
  const outcome = node.outcome!;

  return (
    <article className="outcome-card">
      <div className="outcome-header">
        <div>
          <div className="eyebrow">Suggested path</div>
          <h3>{outcome.title}</h3>
        </div>
        <span className={`urgency urgency-${outcome.urgency.toLowerCase().replace(/\s+/g, "-")}`}>
          {outcome.urgency}
        </span>
      </div>
      <p className="outcome-summary">{outcome.summary}</p>
      <OutcomeSection title="Immediate actions" items={outcome.immediateActions} />
      <OutcomeSection title="Consults" items={outcome.consults} />
      <OutcomeSection title="RT considerations" items={outcome.rtConsiderations} />
      {outcome.notes?.length ? (
        <OutcomeSection title="Notes / cautions" items={outcome.notes} />
      ) : null}
      <div className="disclaimer">
        Educational guide only. Verify against attending guidance, institutional workflows,
        re-irradiation history, and current multidisciplinary recommendations.
      </div>
    </article>
  );
}

function OutcomeSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="outcome-section">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function QuickSectionCard({ section }: { section: QuickSection }) {
  return (
    <section className="panel quick-section-card">
      <h3>{section.title}</h3>
      <ul>
        {section.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function TaperCard({ taper }: { taper: TaperPlan }) {
  return (
    <section className="panel taper-card">
      <h3>{taper.label}</h3>
      <ul>
        {taper.schedule.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
      {taper.note ? <p>{taper.note}</p> : null}
    </section>
  );
}

function FigureModal({
  figure,
  onClose,
}: {
  figure: FlowFigure;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <strong>{figure.title}</strong>
            <span>{figure.caption}</span>
          </div>
          <button className="button-link subtle" onClick={onClose}>
            Close
          </button>
        </div>
        <img className="modal-image" src={figure.src} alt={figure.title} />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer-note">
      <div className="footer-main">
        <span>Built by Johnathan Zeng, MD</span>
      </div>
      <div className="footer-logos" aria-label="Program logos">
        <img src="/logos/ARRO%20Logo.jpg" alt="ARRO logo" className="footer-logo arro-logo" />
        <img src="/logos/HROP%20Logo.jpg" alt="Harvard Radiation Oncology Program logo" className="footer-logo hrop-logo" />
      </div>
      <div className="footer-updated">Last updated: {LAST_UPDATED}</div>
    </footer>
  );
}

function getCurrentNode(flow: { nodes: FlowNode[] }, path: string[]) {
  const currentId = path[path.length - 1];
  return flow.nodes.find((node) => node.id === currentId) ?? flow.nodes[0];
}

export default App;
