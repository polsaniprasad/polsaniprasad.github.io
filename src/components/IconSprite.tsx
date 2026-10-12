import { ICONS } from "@/lib/icons";

/** Every brand mark as an inline <symbol>, rendered once on the server; referenced with <use href="#si-key" />. */
export default function IconSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      {Object.entries(ICONS).map(([key, icon]) => (
        <symbol key={key} id={`si-${key}`} viewBox="0 0 24 24">
          <path d={icon.path} />
        </symbol>
      ))}
    </svg>
  );
}
