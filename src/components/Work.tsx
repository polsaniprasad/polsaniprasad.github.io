import { PROJECTS } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import WorkAccordion from "./WorkAccordion";

export default function Work() {
  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="container">
        <SectionHeading
          index="03"
          label="Selected work"
          id="work-title"
          title={
            <>
              Frameworks, <em>not just tests.</em>
            </>
          }
          aside={<p>Four automation architectures from the last decade. Open a panel to see what each one covered.</p>}
        />
        <WorkAccordion projects={PROJECTS} />
      </div>
    </section>
  );
}
