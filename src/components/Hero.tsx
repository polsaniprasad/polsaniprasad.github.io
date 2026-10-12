import { PROFILE } from "@/lib/data";
import heroMeta from "../../public/media/hero.json";
import HeroVideo from "./HeroVideo";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </p>

      <div className="hero-stage">
        <HeroVideo width={heroMeta.width} height={heroMeta.height} />
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow rise" style={{ "--d": "120ms" } as React.CSSProperties}>
            <span className="dot" aria-hidden="true" /> {PROFILE.name} · {PROFILE.currentTitle} at{" "}
            {PROFILE.currentCompany}
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="sr-only">{PROFILE.name} — </span>
            <span className="line">
              <span className="rise" style={{ "--d": "200ms" } as React.CSSProperties}>
                Senior SDET &amp;
              </span>
            </span>
            <span className="line">
              <span className="rise" style={{ "--d": "300ms" } as React.CSSProperties}>
                <em>QA Automation</em>
              </span>
            </span>
            <span className="line">
              <span className="rise" style={{ "--d": "400ms" } as React.CSSProperties}>
                Engineer
              </span>
            </span>
          </h1>
        </div>

        <div className="hero-side rise" style={{ "--d": "520ms" } as React.CSSProperties}>
          <p className="hero-intro">{PROFILE.intro}</p>
          <div className="hero-ctas">
            <a href="#work" className="btn btn-ink">
              Explore work
              <svg viewBox="0 0 16 16" aria-hidden="true" className="btn-arrow">
                <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
              </svg>
            </a>
            <a href="#contact" className="btn btn-line">
              Let&rsquo;s talk
            </a>
            <a href={PROFILE.resume} download="Prasad-Rao-Resume.pdf" className="btn btn-ghost">
              Résumé
              <svg viewBox="0 0 16 16" aria-hidden="true" className="btn-arrow">
                <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
              </svg>
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
