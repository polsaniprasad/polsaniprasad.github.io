import { ACHIEVEMENTS, NAV, PROFILE } from "@/lib/data";
import SmoothScroll from "@/components/SmoothScroll";
import IconSprite from "@/components/IconSprite";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Work from "@/components/Work";
import Certifications from "@/components/Certifications";
import Timeline from "@/components/Timeline";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// schema.org Person: lets search engines show the name, title and LinkedIn together.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  jobTitle: PROFILE.headline,
  url: `${SITE}/`,
  email: `mailto:${PROFILE.email}`,
  sameAs: [PROFILE.linkedin],
  worksFor: { "@type": "Organization", name: PROFILE.currentCompany },
  address: { "@type": "PostalAddress", addressLocality: "Philadelphia", addressRegion: "PA", addressCountry: "US" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "JNTU" },
  knowsAbout: ["Playwright", "Cypress", "Selenium WebDriver", "Test automation", "API testing", "AI-assisted testing"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <IconSprite />
      <Header name={PROFILE.name} nav={NAV} />
      <main id="top">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Timeline />
        <Achievements items={ACHIEVEMENTS} />
        <Contact
          email={PROFILE.email}
          phone={PROFILE.phone}
          phoneHref={PROFILE.phoneHref}
          resume={PROFILE.resume}
          linkedin={PROFILE.linkedin}
        />
      </main>
      <Footer />
    </>
  );
}
