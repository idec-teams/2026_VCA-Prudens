import reports from "./report-articles.json";
import { sitePath } from "./site-path";
import "./wiki-article.css";
import { PageHero } from "./PageHero";
import { CaptionText } from "./CaptionText";

type Block = { type: string; text?: string; src?: string; width?: number; height?: number; alt?: string };
type Page = { title: string; sections: { id: string; title: string; blocks: Block[] }[] };
const pages: Record<string, Page> = reports;
export const reportSlugs = Object.keys(pages);

export function ReportArticle({ slug }: { slug: string }) {
  const page = pages[slug];
  const coverArt: Record<string, string> = {
    design: "/assets/bridge-builder.png",
    methods: "/assets/experiment.webp",
    engineering: "/assets/engineering.webp",
    results: "/assets/rna-progress.png",
    analysis: "/assets/illustrations-20261005/analysis-painted.webp",
  };
  return <main className="ppt-deck wiki-article" aria-label={`${page.title} article`}>
    <PageHero title={page.title} image={coverArt[slug]} />
    <div className="wiki-article-layout">
      <nav className="project-outline wiki-article-outline" aria-label={`${page.title} sections`}>
        {page.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
      </nav>
      <article className="project-copy-card wiki-article-copy paper-copy report-copy">
        {page.sections.map(section => <section key={section.id} aria-labelledby={section.id}>
          <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
          {section.blocks.map((block, index) => block.type === "image" ? (
            <figure className="paper-figure" key={index}>
              <a href={sitePath(block.src!)} target="_blank" rel="noopener noreferrer">
                <img src={sitePath(block.src!)} width={block.width} height={block.height} loading="lazy" alt={block.alt ?? ""} />
              </a>
            </figure>
          ) : <p key={index} className={block.type === "caption" ? "report-caption" : undefined}>{block.type === "caption" ? <CaptionText text={block.text ?? ""} /> : block.text}</p>)}
        </section>)}
      </article>
    </div>
  </main>;
}
