import { NAV, PROFILE } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-row">
        <p className="footer-name">
          {PROFILE.name} <span>— {PROFILE.headline}</span>
        </p>
        <nav aria-label="Footer">
          <ul className="footer-nav">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-meta">
          <span>© {year}</span>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="to-top">
            LinkedIn ↗
          </a>
          <a href="#top" className="to-top">
            Back to top
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
