import { projectPages, teamNavPages } from "./wiki-data";
import { SiteHeader } from "./SiteHeader";
import { AnimatedDeck } from "./AnimatedDeck";

export function Header() {
  return <SiteHeader teamPages={teamNavPages} projectPages={projectPages} />;
}

export function SlideDeck({ slides, title }: { slides: number[]; title: string }) {
  return <AnimatedDeck slides={slides} title={title} />;
}
