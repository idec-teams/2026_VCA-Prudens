import { sitePath } from "./site-path";
import safety from "./safety-article.json";
import "./document-landing.css";
import { PageHero } from "./PageHero";

const folder = "/assets/documents-20261004";
const researchPdf = `${folder}/responsible-research-form.pdf`;
const supplementPdf = `${folder}/supplementary-material.pdf`;

function PdfActions({ src }: { src: string }) {
  return <div className="document-actions">
    <a className="document-button" href={sitePath(src)} target="_blank" rel="noopener noreferrer">Open full PDF ↗</a>
    <a className="document-button secondary" href={sitePath(src)} download>Download PDF ↓</a>
  </div>;
}

export function DocumentLanding({ slug }: { slug: "safety" | "supplement-files" }) {
  const title = slug === "safety" ? "Safety" : "Supplement Files";
  const icon = slug === "safety" ? "shield-check" : "file-stack";
  return <main className="ppt-deck document-landing" aria-label={title}>
    <PageHero title={title} id="document-title" image={`/assets/report-20261004/${icon}.svg`} />
    {slug === "safety" ? <div className="safety-layout">
      <nav className="document-outline" aria-label="Safety sections">
        {safety.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        <a href="#responsible-research-form">Responsible Research Form</a>
      </nav>
      <div className="safety-content">
        <article className="safety-copy" aria-label="Safety document">
          {safety.sections.map(section => <section key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
            {section.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
          </section>)}
        </article>
        <section className="research-document" aria-labelledby="responsible-research-form">
          <a className="document-paper" href={sitePath(researchPdf)} target="_blank" rel="noopener noreferrer" aria-label="Open the complete 11-page Responsible Research Form PDF">
            <img src={sitePath(`${folder}/responsible-research-cover-hd.webp`)} alt="First page of the iDEC Responsible Research Form" loading="lazy" />
          </a>
          <div>
            <span className="document-label">PDF · 11 PAGES · 929 KB</span>
            <h2 id="responsible-research-form" tabIndex={-1}>iDEC Responsible Research Form</h2>
            <PdfActions src={researchPdf} />
          </div>
        </section>
      </div>
    </div> : <section className="supplement-library" aria-labelledby="supplement-reader-heading">
      <div className="document-reader-heading">
        <div>
          <span className="document-label">PDF · 8 PAGES · 5.59 MB</span>
          <h2 id="supplement-reader-heading">Supplementary Material and Information</h2>
        </div>
        <PdfActions src={supplementPdf} />
      </div>
      <div className="document-reader">
        <div className="document-reader-bar"><span>VCA-Prudens</span><a href="#supplement-page-view">Page-by-page view ↓</a></div>
        <iframe className="document-pdf" src={sitePath(supplementPdf) + "#view=FitH"} title="Complete Supplementary Material and Information PDF — 8 pages" loading="lazy" />
      </div>
      <p className="document-reader-help">If the PDF viewer is unavailable, open the full PDF above or expand the page-by-page view below.</p>
      <details className="document-page-view" id="supplement-page-view">
        <summary>Page-by-page view <span>All 8 pages</span></summary>
        <nav aria-label="Supplementary PDF pages" className="document-page-links">
          {Array.from({ length: 8 }, (_, index) => <a key={index} href={`#supplement-page-${index + 1}`}>{index + 1}</a>)}
        </nav>
        <div className="document-pages">
          {Array.from({ length: 8 }, (_, index) => <figure key={index} id={`supplement-page-${index + 1}`}>
            <figcaption>Page {index + 1} of 8 <a href={sitePath(supplementPdf) + `#page=${index + 1}`} target="_blank" rel="noopener noreferrer">Open in PDF ↗</a></figcaption>
            <a href={sitePath(`${folder}/supplementary-page-${index + 1}-hd.webp`)} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge supplementary page ${index + 1}`}>
              <img src={sitePath(`${folder}/supplementary-page-${index + 1}-hd.webp`)} alt={`Original supplementary material, page ${index + 1} of 8. Use the full PDF for the original document.`} loading="lazy" />
            </a>
          </figure>)}
        </div>
      </details>
    </section>}
  </main>;
}
