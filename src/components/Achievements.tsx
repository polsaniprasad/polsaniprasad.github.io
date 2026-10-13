"use client";

import { useEffect, useRef } from "react";

type Item = { value: number; prefix: string; suffix: string; label: string; detail: string };

const ease = (t: number) => 1 - Math.pow(1 - t, 4);

/** Pinned section: vertical scroll drives a horizontal track; each figure counts up as it arrives. */
export default function Achievements({ items }: { items: readonly Item[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!section || !track || !bar) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Count-up when a card slides into view (IntersectionObserver respects transforms).
    const nums = Array.from(track.querySelectorAll<HTMLElement>("[data-count]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          const to = Number(el.dataset.count);
          const from = to === 0 ? 10 : 0; // zero counts *down* — it's the point
          if (reduce) {
            el.textContent = String(to);
            continue;
          }
          const start = performance.now();
          const dur = 1400;
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / dur);
            el.textContent = String(Math.round(from + (to - from) * ease(t)));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.6 },
    );
    nums.forEach((n) => io.observe(n));

    if (reduce) return () => io.disconnect();

    let distance = 0;
    let raf = 0;
    const measure = () => {
      distance = Math.max(0, track.scrollWidth - track.clientWidth);
      section.style.height = `${distance + window.innerHeight}px`;
      update();
    };
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const p = distance ? Math.min(1, Math.max(0, -r.top / distance)) : 0;
      track.style.transform = `translate3d(${(-p * distance).toFixed(1)}px,0,0)`;
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      section.style.height = "";
    };
  }, []);

  return (
    <section id="achievements" ref={sectionRef} className="pin" aria-labelledby="ach-title">
      <div className="pin-sticky">
        <div className="container pin-head">
          <p className="sec-label">
            <span>(06)</span>
            <span>Achievements</span>
          </p>
          <h2 className="sec-title pin-title" id="ach-title">
            Proof, <em>in numbers.</em>
          </h2>
        </div>
        <div className="pin-track" ref={trackRef}>
          {items.map((a, i) => (
            <article className="stat" key={a.label}>
              <p className="stat-index">
                {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </p>
              <p className="stat-num">
                <span className="sr-only">{`${a.prefix}${a.value}${a.suffix}`}</span>
                <span aria-hidden="true">
                  {a.prefix}
                  <span data-count={a.value}>{a.value}</span>
                  <em>{a.suffix}</em>
                </span>
              </p>
              <h3 className="stat-label">{a.label}</h3>
              <p className="stat-detail">{a.detail}</p>
            </article>
          ))}
          <span className="pin-spacer" aria-hidden="true" />
        </div>
        <div className="container pin-foot" aria-hidden="true">
          <span className="pin-bar">
            <span ref={barRef} />
          </span>
          <span className="pin-hint">Keep scrolling →</span>
        </div>
      </div>
    </section>
  );
}
