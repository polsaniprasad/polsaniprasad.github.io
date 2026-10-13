import { PROJECTS, SITE_QA } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import WorkAccordion from "./WorkAccordion";
import { Suite } from "./WorkVisuals";

export default function Work() {
  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="container">
        <SectionHeading
          index="03"
          label="Selected work"
          id="work-title"
          title={
            <>
              Frameworks, <em>not just tests.</em>
            </>
          }
          aside={<p>Four automation architectures from the last decade. Open a panel to see what each one covered.</p>}
        />
        <WorkAccordion projects={PROJECTS} />

        <article className="site-qa" data-reveal aria-labelledby="site-qa-title">
          <div>
            <p className="acc-meta">
              <span>This portfolio</span>
              <span>Every push</span>
            </p>
            <h3 className="site-qa-title" id="site-qa-title">
              {SITE_QA.title}
            </h3>
            <p className="acc-desc">{SITE_QA.description}</p>
            <ul className="acc-features">
              {SITE_QA.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <ul className="acc-stack" aria-label="Tech stack">
              {SITE_QA.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <Suite />
        </article>
      </div>
    </section>
  );
}
