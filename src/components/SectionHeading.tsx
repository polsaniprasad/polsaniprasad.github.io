import type { ReactNode } from "react";

type Props = { index: string; label: string; title: ReactNode; aside?: ReactNode; id?: string };

export default function SectionHeading({ index, label, title, aside, id }: Props) {
  return (
    <header className="sec-head" data-reveal>
      <p className="sec-label">
        <span>({index})</span>
        <span>{label}</span>
      </p>
      <h2 className="sec-title" id={id}>
        {title}
      </h2>
      {aside ? <div className="sec-aside">{aside}</div> : null}
    </header>
  );
}
