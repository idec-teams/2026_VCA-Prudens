import articles from "./wiki-articles.json";
import "./wiki-article.css";
import { sitePath } from "./site-path";

export function WikiArticle({ slug }: { slug: "description" | "methods" }) {
  const data = articles[slug];
  const coverSlide = "coverSlide" in data ? data.coverSlide : null;
  return (
    <main className="ppt-deck wiki-article" aria-label={`${data.title} article`}>
      {coverSlide && <section className="ppt-slide is-visible" aria-label={`${data.title} cover`}>
        <img src={sitePath(`/slides/slide-${String(coverSlide).padStart(2, "0")}.png`)} alt={`${data.title} cover from the Canva design`} />
      </section>}
      <div className="wiki-article-layout">
        <nav className="project-outline wiki-article-outline" aria-label={`${data.title} sections`}>
          {data.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        </nav>
        <article className="project-copy-card wiki-article-copy">
          <h1>{data.title}</h1>
          {data.sections.map(section => <section key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </section>)}
        </article>
      </div>
    </main>
  );
}
