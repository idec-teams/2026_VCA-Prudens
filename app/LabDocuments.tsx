import documents from "./lab-documents.json";
import { sitePath } from "./site-path";
import "./lab-documents.css";

export function LabDocuments({ slug }: { slug: "notebook" | "protocol" }) {
  const data = documents[slug];
  const isNotebook = slug === "notebook";
  return <main className={`ppt-deck lab-document lab-${slug}`} aria-label={data.title}>
    <header className="lab-document-heading">
      <div>
        <p className="lab-document-subtitle">{data.subtitle}</p>
        <h1>{data.title}</h1>
        <p className="lab-document-intro">{data.intro}</p>
      </div>
      {isNotebook && <img className="lab-notebook-photo" src={sitePath("/slides/slide-31.png")} alt="Recording observations in a laboratory notebook" />}
    </header>
    {isNotebook ? <div className="lab-notebook-layout">
      <nav className="lab-notebook-index" aria-label="Notebook sections">
        {data.sections.map(section => <a key={section.id} href={`#${section.id}`}>
          <span className="lab-entry-date">{section.date}</span>
          <span>{section.title}</span>
        </a>)}
      </nav>
      <article className="lab-notebook-pages" aria-label="Dated laboratory records">
        {data.sections.map(section => <section className="lab-notebook-entry" key={section.id} aria-labelledby={section.id}>
          <h2 id={section.id} tabIndex={-1}><span className="lab-entry-date">{section.date}</span>{"  "}<span>{section.title}</span></h2>
          {section.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
        </section>)}
      </article>
    </div> : <article className="lab-protocol-board" aria-label="Laboratory protocol">
      {data.sections.map(section => <section className="lab-protocol-note" key={section.id} aria-labelledby={section.id}>
        <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
        {section.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
      </section>)}
    </article>}
  </main>;
}
