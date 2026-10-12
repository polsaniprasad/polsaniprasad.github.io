import { ORG_LABEL, SKILL_CATEGORIES, SKILL_GROUPS } from "@/lib/data";
import { ICONS } from "@/lib/icons";
import SectionHeading from "./SectionHeading";
import SkillsTable, { type Tile } from "./SkillsTable";

export default function Skills() {
  let n = 0;
  const tiles: Tile[] = SKILL_GROUPS.flatMap((g) =>
    g.items.map((s) => ({
      n: ++n,
      symbol: s.symbol,
      name: s.name,
      category: s.category,
      note: s.note,
      icon: s.icon ?? null,
      color: s.icon ? ICONS[s.icon].hex : (s.tint ?? null),
      usedAt: s.usedAt.map((o) => ORG_LABEL[o]),
    })),
  );

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading
          index="02"
          label="Skills"
          id="skills-title"
          title={
            <>
              The periodic table <em>of my stack.</em>
            </>
          }
          aside={<p>{tiles.length} elements across eight families — hover or tap one to inspect where it was used.</p>}
        />
        <SkillsTable tiles={tiles} categories={SKILL_CATEGORIES} />
      </div>
    </section>
  );
}
