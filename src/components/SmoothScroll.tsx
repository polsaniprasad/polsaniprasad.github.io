"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Lenis smooth scrolling + a single IntersectionObserver for every [data-reveal] element. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduce ? null : new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -64 } });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((node) => io.observe(node));

    return () => {
      io.disconnect();
      lenis?.destroy();
    };
  }, []);

  return null;
}
