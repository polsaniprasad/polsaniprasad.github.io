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
          aside={<p>From the ISTQB foundation to agentic AI for testing. Linked rows open the public verification.</p>}
        />
        <ol className="ink-list">
          {CERTIFICATIONS.map((c, i) => {
            const body = (
              <>
                <span className="ink-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="ink-title">{c.title}</span>
                <span className="ink-issuer">{c.issuer}</span>
                <span className="ink-tag">{c.tag}</span>
                {c.href ? (
                  <svg className="ink-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 18 18 6M8 6h10v10" />
                  </svg>
                ) : null}
              </>
            );
            return (
              <li key={c.title} className="ink-item" data-reveal style={{ "--i": i } as React.CSSProperties}>
                {c.href ? (
                  <a className="ink-row" href={c.href} target="_blank" rel="noopener noreferrer">
                    {body}
                    <span className="sr-only"> — verify credential (opens in a new tab)</span>
                  </a>
                ) : (
                  <div className="ink-row">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
