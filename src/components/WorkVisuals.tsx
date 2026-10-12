import type { Project } from "@/lib/data";

/** Minimal grayscale, purely illustrative UI sketches — no real data. */
function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="vis" aria-hidden="true">
      <div className="vis-bar">
        <span className="vis-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="vis-title">{title}</span>
        <span className="vis-tag">Illustrative UI</span>
      </div>
      <div className="vis-body">{children}</div>
    </figure>
  );
}

function Agents() {
  const rows = [
    { s: "fail", tag: "Product defect" },
    { s: "fail", tag: "Environment" },
    { s: "pass", tag: "" },
    { s: "fail", tag: "Script issue" },
    { s: "pass", tag: "" },
  ];
  return (
    <Frame title="failure-analysis.agent">
      <div className="va-split">
        <div className="va-col">
          <p className="vis-k">Cucumber + Playwright report</p>
          {rows.map((r, i) => (
            <div className="va-row" key={i} style={{ "--i": i } as React.CSSProperties}>
              <span className={`va-dot va-${r.s}`} />
              <span className="sk" style={{ width: `${48 + ((i * 17) % 30)}%` }} />
              {r.tag ? <span className="va-tag">{r.tag}</span> : null}
            </div>
          ))}
          <div className="va-fix">
            <p className="vis-k">Recommended fix</p>
            <span className="sk" />
            <span className="sk" style={{ width: "72%" }} />
          </div>
        </div>
        <div className="va-col va-gen">
          <p className="vis-k">User story → scenarios</p>
          {["Given", "When", "Then", "And"].map((g, i) => (
            <div className="va-g" key={g} style={{ "--i": i } as React.CSSProperties}>
              <span className="va-kw">{g}</span>
              <span className="sk" style={{ width: `${70 - i * 9}%` }} />
            </div>
          ))}
          <div className="va-mcp">
            <span>Copilot</span>
            <span className="va-link" />
            <span>MCP</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Player() {
  return (
    <Frame title="playback.spec.ts">
      <div className="vp-screen">
        <span className="vp-play" />
        <span className="vp-badge">HLS · DASH</span>
        <span className="vp-badge vp-badge-r">DRM ✓</span>
      </div>
      <div className="vp-track">
        <span className="vp-buffer" />
        <span className="vp-head" />
      </div>
      <div className="vp-lower">
        <div className="vp-ladder">
          <p className="vis-k">ABR ladder</p>
          <div className="vp-bars">
            {[28, 46, 64, 82, 100].map((h, i) => (
              <span key={h} style={{ height: `${h}%`, "--i": i } as React.CSSProperties} />
            ))}
          </div>
        </div>
        <div className="vp-net">
          <p className="vis-k">CDN · intercepted</p>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="vp-req" style={{ "--i": i } as React.CSSProperties}>
              <span className="vp-code">200</span>
              <span className="sk" style={{ width: `${55 + i * 9}%` }} />
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Hybrid() {
  return (
    <Frame title="hybrid-suite / ui ⇄ api">
      <div className="vh-apps">
        {["RoyFi", "Epic Will", "LDV"].map((a, i) => (
          <div key={a} className="vh-app" style={{ "--i": i } as React.CSSProperties}>
            <p>{a}</p>
            <span className="sk" />
            <span className="sk" style={{ width: "60%" }} />
            <span className="vh-pipe">
              <i />
            </span>
            <span className="vh-api">API</span>
          </div>
        ))}
      </div>
      <div className="vh-cal">
        <p className="vis-k">Availability · blackout periods</p>
        <div className="vh-grid">
          {Array.from({ length: 21 }, (_, i) => (
            <span key={i} data-x={i === 9 || i === 10 || i === 16 ? "block" : i === 4 ? "pick" : undefined} />
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Commerce() {
  const steps = ["Catalog", "Cart", "Checkout", "Payment", "Order"];
  return (
    <Frame title="checkout.e2e">
      <ol className="vc-steps">
        {steps.map((s, i) => (
          <li key={s} style={{ "--i": i } as React.CSSProperties}>
            <span className="vc-node" />
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <div className="vc-cards">
        <div className="vc-card">
          <span className="vc-img" />
          <span className="sk" />
          <span className="sk" style={{ width: "50%" }} />
        </div>
        <div className="vc-card">
          <span className="vc-img" />
          <span className="sk" />
          <span className="sk" style={{ width: "64%" }} />
        </div>
        <div className="vc-sum">
          <p className="vis-k">REST API automated</p>
          <p className="vc-num">90%</p>
          <span className="vc-meter">
            <i />
          </span>
        </div>
      </div>
    </Frame>
  );
}

export default function WorkVisual({ kind }: { kind: Project["ui"] }) {
  if (kind === "agents") return <Agents />;
  if (kind === "player") return <Player />;
  if (kind === "hybrid") return <Hybrid />;
  return <Commerce />;
}
