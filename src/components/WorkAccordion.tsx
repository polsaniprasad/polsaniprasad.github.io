"use client";

import { useState } from "react";
import type { Project } from "@/lib/data";
import WorkVisual from "./WorkVisuals";

export default function WorkAccordion({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="acc" data-reveal>
      {projects.map((p, i) => {
        const isOpen = open === i;
        return (
          <article key={p.id} className="acc-panel" data-open={isOpen} aria-labelledby={`${p.id}-h`}>
            <h3 className="acc-h" id={`${p.id}-h`}>
              <button
                type="button"
                className="acc-head"
                aria-expanded={isOpen}
                aria-controls={`${p.id}-body`}
                onClick={() => setOpen(i)}
              >
                <span className="acc-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="acc-org">{p.org}</span>
                <span className="acc-title">{p.title}</span>
                <span className="acc-plus" aria-hidden="true" />
              </button>
            </h3>

            <div className="acc-body" id={`${p.id}-body`} role="region" aria-labelledby={`${p.id}-h`}>
              <div className="acc-body-inner" inert={!isOpen}>
                <div className="acc-content">
                  <div className="acc-text">
                    <p className="acc-meta">
                      <span>{p.org}</span>
                      <span>{p.period}</span>
                    </p>
                    <p className="acc-big">{p.title}</p>
                    <p className="acc-desc">{p.description}</p>
                    <ul className="acc-features">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <ul className="acc-stack" aria-label="Tech stack">
                      {p.stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="acc-visual">
                    <WorkVisual kind={p.ui} />
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
