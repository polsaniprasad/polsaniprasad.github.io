import { CARD_STATS, CERTIFICATIONS, PROFILE } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Lanyard from "./Lanyard";

export default function About() {
  const facts: { k: string; v: string; sub?: string; href?: string; external?: boolean }[] = [
    { k: "Location", v: PROFILE.location, sub: `${PROFILE.currentCompany} · current role` },
    { k: "Education", v: `${PROFILE.education.short} · ${PROFILE.education.score}`, sub: `${PROFILE.education.school}, ${PROFILE.education.place}` },
    { k: "Current role", v: `${PROFILE.currentTitle}, ${PROFILE.currentCompany}`, sub: `Since ${PROFILE.currentSince}` },
    { k: "Email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { k: "LinkedIn", v: "View profile ↗", href: PROFILE.linkedin, external: true },
  ];

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading
          index="01"
          label="About"
          id="about-title"
          title={
            <>
              Quality, engineered <em>into every stage.</em>
            </>
          }
        />

        <div className="about-grid">
          <div className="about-summary" data-reveal>
            {PROFILE.summary.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <div className="about-links">
              <a href="#experience" className="link-arrow">
                Read the timeline <span aria-hidden="true">→</span>
              </a>
              <a href={PROFILE.resume} download="Prasad-Rao-Resume.pdf" className="link-arrow">
                Download résumé <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="about-card">
            <Lanyard
              name={PROFILE.name}
              role={PROFILE.headline}
              since={PROFILE.careerStart}
              base={PROFILE.location}
              email={PROFILE.email}
              degree={`${PROFILE.education.degree.replace("Electrical & Electronics Engineering", "EEE")}`}
              school={`${PROFILE.education.school}, ${PROFILE.education.place}`}
              score={PROFILE.education.score}
              certs={CERTIFICATIONS.filter((c) => c.onCard).map((c) => c.title)}
              stats={CARD_STATS}
            />
          </div>

          <dl className="about-facts" data-reveal>
            {facts.map((f) => (
              <div key={f.k} className="fact">
                <dt>{f.k}</dt>
                <dd>
                  {f.href ? (
                    <a
                      href={f.href}
                      className="fact-link"
                      {...(f.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {f.v}
                    </a>
                  ) : (
                    f.v
                  )}
                  {f.sub ? <span className="fact-sub">{f.sub}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
