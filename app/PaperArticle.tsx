import manuscript from "./paper-articles.json";
import "./wiki-article.css";
import { PageHero } from "./PageHero";
import { sitePath } from "./site-path";

type Block = { type: string; text?: string; figure?: number; sourceParagraph?: number };
type PaperPage = { title: string; sections: { id: string; title: string; blocks: Block[] }[] };
type Figure = { number: number; src: string | null; width?: number; height?: number; caption: string; note?: string };
const pages: Record<string, PaperPage> = manuscript.pages;
const figures: Record<string, Figure> = manuscript.figures;
export const paperSlugs = Object.keys(pages);

export function PaperArticle({ slug }: { slug: string }) {
  const page = pages[slug];
  return <main className="ppt-deck wiki-article" aria-label={`${page.title} article`}>
    <PageHero title={page.title} />
    <div className="wiki-article-layout">
      <nav className="project-outline wiki-article-outline" aria-label={`${page.title} sections`}>
        {page.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
      </nav>
      <article className="project-copy-card wiki-article-copy paper-copy">
        {page.sections.map(section => <section key={section.id} aria-labelledby={section.id}>
          <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
          {section.blocks.map((block, index) => {
            if (block.type === "figure") {
              const figure = figures[String(block.figure)];
              return <figure className="paper-figure" id={`figure-${figure.number}`} key={index}>
                {figure.src && <a href={sitePath(figure.src)} target="_blank" rel="noopener noreferrer" aria-label={`Open full-resolution Figure ${figure.number}`}>
                  <img src={sitePath(figure.src)} width={figure.width} height={figure.height} loading="lazy" alt={figure.caption.split('. ').slice(0, 2).join('. ')} />
                </a>}
                <figcaption>{figure.caption}</figcaption>
                {figure.note && <p className="paper-note">{figure.note}</p>}
                {figure.src && <a className="figure-original" href={sitePath(figure.src)} target="_blank" rel="noopener noreferrer">View full-size figure {figure.number}</a>}
              </figure>;
            }
            return <p key={index} className={block.type === "note" ? "paper-note" : undefined}>{block.text}</p>;
          })}
        </section>)}
      </article>
    </div>
  </main>;
}
