import documents from "./lab-documents.json";
import { sitePath } from "./site-path";
import "./lab-documents.css";
import { NotebookReader } from "./NotebookReader";
import { LabRichText } from "./LabRichText";

export function LabDocuments({ slug }: { slug: "notebook" | "protocol" }) {
  const data = documents[slug];
  const isNotebook = slug === "notebook";
  return <main className={`ppt-deck lab-document lab-${slug}`} aria-label={data.title}>
    <header className="lab-document-heading">
      <div>
        <p className="lab-document-subtitle" data-source-paragraph={isNotebook ? undefined : 1}>{isNotebook ? data.subtitle : <LabRichText runs={documents.protocol.subtitleRuns} />}</p>
        <h1 data-source-paragraph={isNotebook ? undefined : 0}>{isNotebook ? data.title : <LabRichText runs={documents.protocol.titleRuns} />}</h1>
        <p className="lab-document-intro" data-source-paragraph={isNotebook ? undefined : 2}>{isNotebook ? data.intro : <LabRichText runs={documents.protocol.introRuns} />}</p>
      </div>
      {isNotebook && <img className="lab-notebook-photo" src={sitePath("/slides/slide-31.png")} alt="Recording observations in a laboratory notebook" />}
    </header>
    {isNotebook ? <NotebookReader sections={documents.notebook.sections} sourceTitle={documents.notebook.sourceTitle} sourceTitleRuns={documents.notebook.sourceTitleRuns} /> : <article className="lab-protocol-board" aria-label="Laboratory protocol">
      {documents.protocol.sections.map(section => <section className="lab-protocol-note" key={section.id} aria-labelledby={section.id}>
        <h2 id={section.id} tabIndex={-1} data-source-paragraph={section.sourceIndex}><LabRichText runs={section.headingRuns.map((run, index) => ({...run, text: index === 0 ? run.text.replace(/^\d+ /, "") : run.text}))} /></h2>
        {section.blocks.map((block, index) => <p key={index} data-source-paragraph={block.sourceIndex}><LabRichText runs={block.runs} text={block.text} /></p>)}
      </section>)}
    </article>}
  </main>;
}
