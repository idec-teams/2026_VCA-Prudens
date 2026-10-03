import reports from "./report-articles.json";
import { sitePath } from "./site-path";
import "./wiki-article.css";

type Block = { type: string; text?: string; src?: string; width?: number; height?: number; alt?: string };
type Page = { title: string; sections: { id: string; title: string; blocks: Block[] }[] };
const pages: Record<string, Page> = reports;
export const reportSlugs = Object.keys(pages);

export function ReportArticle({ slug }: { slug: string }) {
  const page = pages[slug];
  return <main className="ppt-deck wiki-article" aria-label={`${page.title} article`}>
    <div className="wiki-article-layout">
      <nav className="project-outline wiki-article-outline" aria-label={`${page.title} sections`}>
        {page.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
      </nav>
      <article className="project-copy-card wiki-article-copy paper-copy report-copy">
        <h1>{page.title}</h1>
        {page.sections.map(section => <section key={section.id} aria-labelledby={section.id}>
          <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
          {section.blocks.map((block, index) => block.type === "image" ? (
            <figure className="paper-figure" key={index}>
              <a href={sitePath(block.src!)} target="_blank" rel="noopener noreferrer">
                <img src={sitePath(block.src!)} width={block.width} height={block.height} loading="lazy" alt={block.alt ?? ""} />
              </a>
            </figure>
          ) : <p key={index} className={block.type === "caption" ? "report-caption" : undefined}>{block.text}</p>)}
        </section>)}
      </article>
    </div>
  </main>;
}
