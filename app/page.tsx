import type { Metadata } from "next";
import { Header } from "./WikiShell";
import { HomeStory } from "./HomeStory";
import { sitePath } from "./site-path";
import { HomeExperience } from "./HomeExperience";
import "./home-enhancements.css";

export const metadata: Metadata = {
  title: "VCA-Prudens | Directed Evolution of ISCro4",
  description: "The VCA-Prudens iDEC wiki for DMS-guided evolution of the ISCro4 bridge recombinase.",
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="home-page">
        <HomeExperience />
        <section className="home-hero">
          <div className="home-hero-copy">
            <span className="hero-accent" aria-hidden="true" />
            <div className="hero-title-scene">
              <img className="hero-title-art" src={sitePath("/assets/home-genetic-health-20261007.png")} width={1536} height={1024} alt="" aria-hidden="true" />
              <h1>Directed Evolution<br />of ISCro4</h1>
            </div>
            <p className="home-hero-lead">Biomni-assisted, DMS-guided directed evolution in <em>E. coli</em></p>
            <div className="strategy-card">
              <strong>AI proposes, human verifies</strong>
              <span>Ten candidates screened; A225S improved activity over the engineered parent</span>
            </div>
            <div className="hero-actions" aria-label="Home page actions">
              <a className="primary-button" href={sitePath("/description")}>Explore the project</a>
              <a className="secondary-button" href={sitePath("/members")}>Meet the team <span aria-hidden="true">→</span></a>
              <a className="scroll-link" href="#slide-2">Scroll to discover <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="home-hero-art">
            <div className="hero-orbit" aria-hidden="true"><i /><i /><i /></div>
            <img src={sitePath("/assets/iscro4-bridge.webp")} alt="ISCro4 bridge RNA-guided recombination diagram" />
            <strong>bridge RNA-guided recombination</strong>
          </div>
          <ul className="hero-keywords" aria-label="Project keywords">
            {["Directed evolution", "AI scientific agent", "ISCro4", "Genome editing", "RNA-guided recombination"].map(keyword => <li key={keyword}>{keyword}</li>)}
          </ul>
          <div className="hero-wave hero-wave-one" aria-hidden="true" />
          <div className="hero-wave hero-wave-two" aria-hidden="true" />
        </section>
        <HomeStory />
      </main>
    </>
  );
}
