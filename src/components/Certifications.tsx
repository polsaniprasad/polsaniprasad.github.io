import { CERTIFICATIONS } from "@/lib/data";
import SectionHeading from "./SectionHeading";

export default function Certifications() {
  return (
    <section id="certifications" className="section certs" aria-labelledby="certs-title">
      <div className="container">
        <SectionHeading
          index="04"
          label="Certifications"
          id="certs-title"
          title={
            <>
              Credentials, <em>kept current.</em>
            </>
          }
          aside={<p>From the ISTQB foundation to agentic AI for testing.</p>}
        />
        <ol className="ink-list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title} className="ink-row" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <span className="ink-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="ink-title">{c.title}</span>
              <span className="ink-issuer">{c.issuer}</span>
              <span className="ink-tag">{c.tag}</span>
              <svg className="ink-arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 18 18 6M8 6h10v10" />
              </svg>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
