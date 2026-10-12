"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

type Props = {
  name: string;
  role: string;
  since: string;
  base: string;
  email: string;
  degree: string;
  school: string;
  score: string;
  certs: readonly string[];
  stats: readonly { value: string; label: string }[];
};

/**
 * A hanging ID card on a lanyard. A tiny spring simulation swings it from the
 * strap's anchor point in response to pointer movement; hover (mouse) or tap flips it.
 */
export default function Lanyard(props: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const pointerType = useRef("mouse");
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const pivot = pivotRef.current;
    const tilt = tiltRef.current;
    if (!root || !pivot || !tilt) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let angle = 0; // deg, pendulum swing around the anchor
    let vel = 0;
    let tiltX = 0;
    let tiltY = 0;
    let targetTX = 0;
    let targetTY = 0;
    let lastX: number | null = null;
    let lastT = 0;
    let raf = 0;
    let visible = false;
    let prev = performance.now();

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null && now - lastT < 100) {
        const vx = (e.clientX - lastX) / Math.max(8, now - lastT); // px per ms
        vel += Math.max(-1, Math.min(1, vx)) * 18;
      }
      lastX = e.clientX;
      lastT = now;

      const r = root.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const ny = (e.clientY - (r.top + r.height * 0.6)) / (window.innerHeight / 2);
      targetTY = Math.max(-1, Math.min(1, nx)) * 10;
      targetTX = Math.max(-1, Math.min(1, ny)) * -8;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      // damped spring + a slow idle sway
      const idle = Math.sin(now / 1400) * 0.9;
      const acc = -38 * (angle - idle) - 3.2 * vel;
      vel += acc * dt;
      angle += vel * dt;
      angle = Math.max(-16, Math.min(16, angle));
      tiltX += (targetTX - tiltX) * 0.08;
      tiltY += (targetTY - tiltY) * 0.08;

      pivot.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      tilt.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${(tiltY - angle * 0.8).toFixed(2)}deg)`;
      if (visible) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Hover-to-flip, measured against a static box where the card hangs. DOM hover events on the
  // rotating 3D card itself flicker (the hit area changes as it turns), which caused endless flipping.
  useEffect(() => {
    const hit = hitRef.current;
    if (!hit) return;
    let hovering = false;
    const set = (next: boolean) => {
      if (next === hovering) return;
      hovering = next;
      setFlipped(next);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = hit.getBoundingClientRect();
      const pad = hovering ? 28 : 0; // hysteresis so the edge never chatters
      set(
        e.clientX >= r.left - pad &&
          e.clientX <= r.right + pad &&
          e.clientY >= r.top - pad &&
          e.clientY <= r.bottom + pad,
      );
    };
    const onLeave = () => set(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  const toggle = () => setFlipped((f) => !f);

  return (
    <div className="lanyard" ref={rootRef}>
      <div className="idcard-hit" ref={hitRef} aria-hidden="true" />
      <div className="lanyard-pivot" ref={pivotRef}>
        <div className="lanyard-strap" aria-hidden="true">
          <span className="strap strap-l">
            <span>{props.name.toUpperCase()} · QA AUTOMATION · {props.name.toUpperCase()} · QA AUTOMATION ·</span>
          </span>
          <span className="strap strap-r">
            <span>SDET · PLAYWRIGHT · CYPRESS · SELENIUM · SDET · PLAYWRIGHT · CYPRESS ·</span>
          </span>
          <span className="lanyard-ring" />
          <span className="lanyard-clip" />
        </div>

        <div className="idcard-tilt" ref={tiltRef}>
          <div
            role="button"
            tabIndex={0}
            className="idcard"
            data-flipped={flipped}
            aria-pressed={flipped}
            aria-label={`Developer ID card for ${props.name}. Press to flip.`}
            onPointerDown={(e) => (pointerType.current = e.pointerType)}
            onClick={() => {
              // mouse users flip on hover; touch and pen flip on tap
              if (pointerType.current !== "mouse") toggle();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            }}
          >
            <div className="idcard-face idcard-front">
              <span className="idcard-slot" aria-hidden="true" />
              <div className="idcard-top">
                <span className="idcard-mark" aria-hidden="true">
                  PR
                </span>
                <span className="idcard-kicker">Developer ID</span>
              </div>
              <div className="idcard-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/media/portrait-bust.webp")} alt={`Portrait of ${props.name}`} width={480} height={576} loading="lazy" />
              </div>
              <p className="idcard-name">{props.name}</p>
              <p className="idcard-role">{props.role}</p>
              <dl className="idcard-fields">
                <div>
                  <dt>Dept.</dt>
                  <dd>QA Automation</dd>
                </div>
                <div>
                  <dt>Since</dt>
                  <dd>{props.since}</dd>
                </div>
                <div>
                  <dt>Base</dt>
                  <dd>{props.base}</dd>
                </div>
                <div>
                  <dt>Valid till</dt>
                  <dd>Present</dd>
                </div>
              </dl>
              <span className="idcard-barcode" aria-hidden="true" />
            </div>

            <div className="idcard-face idcard-back">
              <span className="idcard-slot" aria-hidden="true" />
              <p className="idcard-kicker">Education</p>
              <p className="idcard-degree">{props.degree}</p>
              <p className="idcard-meta">
                {props.school} · {props.score}
              </p>
              <p className="idcard-kicker">Certifications</p>
              <ul className="idcard-certs">
                {props.certs.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="idcard-kicker">By the numbers</p>
              <dl className="idcard-stats">
                {props.stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="idcard-return">If found, return to {props.email}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="lanyard-hint" aria-hidden="true">
        <span className="hint-mouse">Hover to flip</span>
        <span className="hint-touch">Tap to flip</span>
      </p>
    </div>
  );
}
