"use client";

import { useRef, useState } from "react";

type Props = { email: string; phone: string; phoneHref: string; resume: string };

const HEADLINE: { word: string; accent?: boolean }[] = [
  { word: "Let’s" },
  { word: "build" },
  { word: "something" },
  { word: "together.", accent: true },
];

export default function Contact({ email, phone, phoneHref, resume }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };

  const bounce = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget.firstElementChild;
    if (!el || el.classList.contains("is-bouncing")) return;
    el.classList.add("is-bouncing");
    el.addEventListener("animationend", () => el.classList.remove("is-bouncing"), { once: true });
  };

  let i = 0;
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <p className="sec-label" data-reveal>
          <span>(07)</span>
          <span>Contact</span>
        </p>
        <h2 className="bouncy" id="contact-title" aria-label="Let’s build something together." data-reveal>
          {HEADLINE.map(({ word, accent }) => (
            <span key={word} className={accent ? "bw bw-accent" : "bw"} aria-hidden="true">
              {Array.from(word).map((ch, j) => (
                <span key={j} className="bl" style={{ "--i": i++ } as React.CSSProperties} onPointerEnter={bounce}>
                  <span className="bli">{ch}</span>
                </span>
              ))}
            </span>
          ))}
        </h2>

        <div className="contact-row" data-reveal>
          <button type="button" className="email-chip" onClick={copy} aria-describedby="copy-status">
            <span className="email-text">{email}</span>
            <span className="email-action" data-copied={copied}>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="i-copy">
                <rect x="6.5" y="6.5" width="9" height="10" rx="2" />
                <path d="M4 13V5a1.5 1.5 0 0 1 1.5-1.5H12" />
              </svg>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="i-check">
                <path d="m4.5 10.5 3.5 3.5 7.5-8" />
              </svg>
              <span>{copied ? "Copied" : "Copy"}</span>
            </span>
          </button>
          <p id="copy-status" className="sr-only" aria-live="polite">
            {copied ? "Email address copied to clipboard" : "Copies the email address"}
          </p>

          <div className="contact-links">
            <a href={`mailto:${email}`} className="link-arrow">
              Write an email <span aria-hidden="true">↗</span>
            </a>
            <a href={phoneHref} className="link-arrow">
              {phone} <span aria-hidden="true">↗</span>
            </a>
            <a href={resume} download="Prasad-Rao-Resume.pdf" className="link-arrow">
              Résumé (PDF) <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
