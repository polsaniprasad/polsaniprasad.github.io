"use client";

import { useEffect, useRef } from "react";

/** Draws the vertical path as the section scrolls and lights up each node once it is reached. */
export default function TimelineTrack({ children }: { children: React.ReactNode }) {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>(":scope > .tl-item"));
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      const anchor = window.innerHeight * 0.62;
      const p = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
      fill.style.transform = `scaleY(${p.toFixed(4)})`;
      const reached = anchor - r.top;
      for (const item of items) item.classList.toggle("is-on", item.offsetTop + 28 <= reached);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="tl">
      <span className="tl-line" aria-hidden="true">
        <span className="tl-fill" ref={fillRef} />
      </span>
      <ol className="tl-list" ref={listRef}>
        {children}
      </ol>
    </div>
  );
}
