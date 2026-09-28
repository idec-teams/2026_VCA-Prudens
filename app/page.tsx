import type { Metadata } from "next";
import { Header } from "./WikiShell";
import { HomeStory } from "./HomeStory";
import { sitePath } from "./site-path";

export const metadata: Metadata = {
  title: "VCA-Prudens | Directed Evolution of ISCro4",
  description: "The VCA-Prudens iDEC wiki for DMS-guided evolution of the ISCro4 bridge recombinase.",
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="home-hero">
          <div className="home-hero-copy">
            <span className="hero-accent" aria-hidden="true" />
            <h1>Directed Evolution<br />of ISCro4</h1>
            <p className="home-hero-lead">Biomni-assisted, DMS-guided directed evolution in <em>E. coli</em></p>
            <div className="strategy-card">
              <strong>AI proposes, human verifies</strong>
              <span>Ten candidates screened; A225S improved activity over the engineered parent</span>
            </div>
            <div className="hero-actions" aria-label="Home page actions">
              <a className="primary-button" href={sitePath("/description")}>Explore the project</a>
              <a className="secondary-button" href={sitePath("/team")}>Meet the team <span aria-hidden="true">→</span></a>
              <a className="scroll-link" href="#slide-2">Scroll to discover <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="home-hero-art">
            <img src={sitePath("/assets/iscro4-bridge.webp")} alt="ISCro4 bridge RNA-guided recombination diagram" />
            <strong>bridge RNA-guided recombination</strong>
          </div>
          <div className="hero-wave hero-wave-one" aria-hidden="true" />
          <div className="hero-wave hero-wave-two" aria-hidden="true" />
        </section>
        <HomeStory />
      </main>
    </>
  );
}
