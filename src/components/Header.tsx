"use client";

import { useEffect, useState } from "react";

type Props = { name: string; nav: readonly { id: string; label: string }[] };

export default function Header({ name, nav }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header" data-scrolled={scrolled || open} data-open={open}>
      <div className="container site-header-row">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            PR
          </span>
          <span className="brand-name">{name}</span>
        </a>
        <nav aria-label="Primary" className="site-nav" id="site-nav">
          <ul>
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#contact" className="btn btn-ink btn-sm header-cta">
          Let&rsquo;s talk
        </a>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="menu-lines" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
