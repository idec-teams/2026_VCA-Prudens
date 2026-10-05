import { sitePath } from "./site-path";

/** Shared presentation only; titles and subtitles come from existing page content. */
export function PageHero({ title, subtitle, image, id }: {
  title: string; subtitle?: string; image: string; id?: string;
}) {
  return <header className="page-hero" aria-label={title + " cover"}>
    <div className="page-hero-copy">
      <span className="page-hero-rule" aria-hidden="true" />
      <h1 id={id}>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    <div className="page-hero-art" aria-hidden="true">
      <span className="page-hero-orbit" /><span className="page-hero-orbit orbit-cross" />
      <span className="hero-glass-chip"><b /><b /><b /></span>
      <span className="hero-glass-chip chip-secondary"><b /><b /></span>
      <img src={sitePath(image)} alt="" />
      <i /><i /><i />
    </div>
  </header>;
}
