import { EDUCATION, EXPERIENCE } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import TimelineTrack from "./TimelineTrack";

export default function Timeline() {
  const edu = EDUCATION[0];
  return (
    <section id="experience" className="section timeline" aria-labelledby="exp-title">
      <div className="container">
        <SectionHeading
          index="05"
          label="Experience & Education"
          id="exp-title"
          title={
            <>
              A decade, <em>one direction.</em>
            </>
          }
          aside={<p>From manual QA in Hyderabad to AI-assisted automation at Comcast.</p>}
        />

        <TimelineTrack>
          <li className="tl-item tl-edu">
            <span className="tl-node" aria-hidden="true" />
            <div className="tl-meta">
              <span className="tl-kind">Education</span>
              <span className="tl-period">{edu.score}</span>
            </div>
            <article className="tl-card">
              <h3 className="tl-role">{edu.degree}</h3>
              <p className="tl-org">
                {edu.school} <span>· {edu.place}</span>
              </p>
            </article>
          </li>

          {EXPERIENCE.map((r) => (
            <li className="tl-item" key={r.org}>
              <span className="tl-node" aria-hidden="true" />
              <div className="tl-meta">
                <span className="tl-kind">Experience</span>
                <span className="tl-period">{r.period}</span>
              </div>
              <article className="tl-card">
                <h3 className="tl-role">{r.title}</h3>
                <p className="tl-org">
                  {r.org} <span>· {r.place}</span>
                </p>
                <ul className="tl-points">
                  {r.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <ul className="tl-stack" aria-label="Tools">
                  {r.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}

          <li className="tl-item tl-next">
            <span className="tl-node" aria-hidden="true" />
            <div className="tl-meta">
              <span className="tl-kind">Next</span>
              <span className="tl-period">—</span>
            </div>
            <a href="#contact" className="tl-card tl-dashed">
              <span className="tl-role">
                Next — <em>your team?</em>
              </span>
              <span className="tl-org">Let&rsquo;s talk about what you&rsquo;re shipping →</span>
            </a>
          </li>
        </TimelineTrack>
      </div>
    </section>
  );
}
