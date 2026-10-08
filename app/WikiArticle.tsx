import articles from "./wiki-articles.json";
import "./wiki-article.css";
import { PageHero } from "./PageHero";
import { ArticleOutline } from "./ArticleOutline";
import { ScientificText } from "./ScientificText";

export function WikiArticle({ slug }: { slug: "description" | "methods" }) {
  const original = articles[slug];
  const data = slug === "description" ? {
    ...original,
    sections: original.sections.flatMap(section => section.id === "project-description" ? [
      { id: "method", title: "Method", paragraphs: [] },
      ...articles.methods.sections.map(section => ({ ...section, isChild: true })),
      section,
    ] : [section]),
  } : original;
  const outline = data.sections.filter(section => !("isChild" in section)).map(section =>
    section.id === "method" ? { ...section, children: articles.methods.sections } : section);
  return (
    <main className="ppt-deck wiki-article" aria-label={`${data.title} article`}>
      <PageHero title={data.title} subtitle={slug === "description" ? "Dive deep into our project" : undefined} image="/assets/book.webp" />
      <div className="wiki-article-layout">
        <ArticleOutline title={data.title} sections={outline} />
        <article className="project-copy-card wiki-article-copy">
          {data.sections.map(section => <section key={section.id} className={"isChild" in section ? "method-subsection" : undefined} aria-labelledby={section.id}>
            {"isChild" in section ? <h3 id={section.id} tabIndex={-1}>{section.title}</h3> : <h2 id={section.id} tabIndex={-1}>{section.title}</h2>}
            {section.paragraphs.map((paragraph, index) => <p key={index}><ScientificText text={paragraph} /></p>)}
          </section>)}
        </article>
      </div>
    </main>
  );
}
