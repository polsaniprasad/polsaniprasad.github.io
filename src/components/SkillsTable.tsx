"use client";

import { useState } from "react";

export type Tile = {
  n: number;
  symbol: string;
  name: string;
  category: string;
  note: string;
  icon: string | null;
  color: string | null;
  usedAt: string[];
};

type Props = { tiles: Tile[]; categories: readonly { id: string; label: string; short: string }[] };

const pad = (n: number) => String(n).padStart(2, "0");

/** Soft glow colour for a brand: near-black brands get a neutral gray glow. */
function glow(hex: string | null) {
  if (!hex) return "rgba(13,13,13,0.14)";
  const v = parseInt(hex.slice(1), 16);
  const r = (v >> 16) & 255, g = (v >> 8) & 255, b = v & 255;
  return r + g + b < 120 ? "rgba(13,13,13,0.16)" : `rgba(${r},${g},${b},0.28)`;
}

function Mark({ tile, size }: { tile: Tile; size: "sm" | "lg" }) {
  if (tile.icon) {
    return (
      <svg className={`mark mark-${size}`} viewBox="0 0 24 24" aria-hidden="true">
        <use href={`#si-${tile.icon}`} />
      </svg>
    );
  }
  return (
    <span className={`mark mark-${size} mark-mono`} aria-hidden="true">
      {tile.symbol}
    </span>
  );
}

export default function SkillsTable({ tiles, categories }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<Tile>(tiles[0]);
  const label = (id: string) => categories.find((c) => c.id === id);
  const count = filter === "all" ? tiles.length : tiles.filter((t) => t.category === filter).length;

  return (
    <div className="ptable">
      <div className="chips" role="toolbar" aria-label="Filter skills by category" data-reveal>
        <button type="button" className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All <span className="chip-count">{tiles.length}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className="chip"
            aria-pressed={filter === c.id}
            onClick={() => setFilter((f) => (f === c.id ? "all" : c.id))}
          >
            {c.label}
          </button>
        ))}
        <span className="sr-only" aria-live="polite">
          {count} skills shown
        </span>
      </div>

      <div className="ptable-body">
        <ul className="ptable-grid" aria-label="Skills" data-reveal>
          {tiles.map((t) => {
            const dim = filter !== "all" && t.category !== filter;
            return (
              <li key={t.n} className="el-cell" style={{ "--i": t.n } as React.CSSProperties}>
                <button
                  type="button"
                  className="el"
                  data-dim={dim}
                  data-active={active.n === t.n}
                  style={{ "--brand": t.color ?? "#0d0d0d", "--glow": glow(t.color) } as React.CSSProperties}
                  onPointerEnter={() => setActive(t)}
                  onFocus={() => setActive(t)}
                  onClick={() => setActive(t)}
                  aria-label={`${t.name}, ${label(t.category)?.label}`}
                  tabIndex={dim ? -1 : 0}
                >
                  <span className="el-n">{pad(t.n)}</span>
                  <Mark tile={t} size="sm" />
                  <span className="el-sym">{t.symbol}</span>
                  <span className="el-name">{t.name}</span>
                  <span className="el-cat">{label(t.category)?.short}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="inspector" aria-live="polite" aria-label="Skill details">
          <div
            className="inspector-card"
            key={active.n}
            style={{ "--brand": active.color ?? "#0d0d0d", "--glow": glow(active.color) } as React.CSSProperties}
          >
            <div className="inspector-top">
              <div className="inspector-logo">
                <Mark tile={active} size="lg" />
              </div>
              <div className="inspector-id">
                <span>No. {pad(active.n)}</span>
                <span className="inspector-sym">{active.symbol}</span>
              </div>
            </div>
            <p className="inspector-cat">{label(active.category)?.label}</p>
            <h3 className="inspector-name">{active.name}</h3>
            <p className="inspector-note">{active.note}</p>
            <div className="inspector-used">
              <p className="inspector-k">Used at</p>
              {active.usedAt.length ? (
                <ul>
                  {active.usedAt.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              ) : (
                <p className="inspector-none">Listed in the résumé’s technical skills</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
