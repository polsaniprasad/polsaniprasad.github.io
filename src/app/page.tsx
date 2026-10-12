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

export default function Home() {
  return (
    <>
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
