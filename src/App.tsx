import { useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { categoryLabels, emergencyFlows } from "./data/emergencies";
import { EmergencyFlow, FlowNode } from "./types";

const flowMap = new Map(emergencyFlows.map((flow) => [flow.id, flow]));

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/emergency/:flowId" element={<EmergencyPage />} />
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
          placeholder="Try hemoptysis, cord compression, LMD, dysphagia..."
        />
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
    </div>
  );
}

function Hero() {
  return (
    <header className="hero">
      <div className="hero-copy">
        <div className="eyebrow">Radiation Oncology On-Call</div>
        <h1>Interactive emergency pathways built from your ARRO and ROCK source files.</h1>
        <p>
          Click into an emergency, branch through key triage decisions, and surface
          a concise action frame for consults, temporizing measures, and RT planning.
        </p>
      </div>
      <div className="hero-panel">
        <div className="stat">
          <span className="stat-number">{emergencyFlows.length}</span>
          <span className="stat-label">seeded pathways</span>
        </div>
        <div className="stat">
          <span className="stat-number">Local</span>
          <span className="stat-label">Vite dev + static build</span>
        </div>
        <div className="stat">
          <span className="stat-number">Deployable</span>
          <span className="stat-label">GitHub Pages or Vercel</span>
        </div>
      </div>
    </header>
  );
}

function EmergencyPage() {
  const { flowId } = useParams();
  const flow = flowId ? flowMap.get(flowId) : undefined;
  const location = useLocation();

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
        <span className="route-chip">{location.pathname}</span>
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
            <strong>Source basis</strong>
            <span>{flow.sources.join(" • ")}</span>
          </div>
        </div>
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

function FlowExplorer({ flow }: { flow: EmergencyFlow }) {
  const [path, setPath] = useState<string[]>(["start"]);
  const currentNode = getCurrentNode(flow, path);
  const visitedNodes = path
    .map((id) => flow.nodes.find((node) => node.id === id))
    .filter(Boolean) as FlowNode[];

  const reset = () => setPath(["start"]);

  return (
    <section className="explorer">
      <div className="explorer-header">
        <div>
          <div className="eyebrow">Interactive pathway</div>
          <h2>{currentNode.prompt}</h2>
          <p>{currentNode.detail}</p>
        </div>
        <button className="reset-button" onClick={reset}>
          Reset flow
        </button>
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

function getCurrentNode(flow: EmergencyFlow, path: string[]) {
  const currentId = path[path.length - 1];
  return flow.nodes.find((node) => node.id === currentId) ?? flow.nodes[0];
}

export default App;
