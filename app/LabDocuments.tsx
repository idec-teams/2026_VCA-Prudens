import documents from "./lab-documents.json";
import { sitePath } from "./site-path";
import "./lab-documents.css";
import { NotebookReader } from "./NotebookReader";

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
    {isNotebook ? <NotebookReader sections={documents.notebook.sections} sourceTitle={documents.notebook.sourceTitle} /> : <article className="lab-protocol-board" aria-label="Laboratory protocol">
      {documents.protocol.sections.map(section => <section className="lab-protocol-note" key={section.id} aria-labelledby={section.id}>
        <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
        {section.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
      </section>)}
    </article>}
  </main>;
}
