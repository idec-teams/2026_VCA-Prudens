"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { sitePath } from "./site-path";
import { notebookPages, notebookPageForHash } from "./notebook-pagination.mjs";
import { LabRichText, type LabRun } from "./LabRichText";

type Cell = { colSpan: number; rowSpan?: number; merge?: string; blocks: Block[] };
type Block = { type: string; text?: string; runs?: LabRun[]; sourceIndex?: number; prefix?: string; src?: string; width?: number; height?: number; alt?: string; rows?: Cell[][] };
type Section = { id: string; sourceHeading: string; headingRuns: LabRun[]; sourceIndex: number; title: string; date: string; blocks: Block[] };
type Page = { id: string; sectionIndex: number; part: number; blocks: Block[] };

function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((block, index) => {
    if (block.type === "image") return <figure className="lab-record-image" key={index}>
      <a href={sitePath(block.src!)} target="_blank" rel="noopener noreferrer" aria-label="Open laboratory image at full size">
        <img src={sitePath(block.src!)} width={block.width} height={block.height} alt={block.alt} loading="lazy" />
      </a>
    </figure>;
    if (block.type === "gallery") return <div className="lab-record-gallery" key={index}>
      {block.rows!.flat().map((cell, cellIndex) => <div key={cellIndex}><Blocks blocks={cell.blocks} /></div>)}
    </div>;
    if (block.type === "table") return <div className="lab-record-table-scroll" key={index} role="region" aria-label="Laboratory data table, scroll horizontally for all columns" tabIndex={0}>
      <table className={`lab-record-table${block.rows![0].length > 4 ? " lab-record-table-wide" : ""}`}><tbody>{block.rows!.map((row, rowIndex) => <tr key={rowIndex}>
        {row.map((cell, cellIndex) => {
          if (cell.merge === "continue") return null;
          const Tag = rowIndex === 0 ? "th" : "td";
          return <Tag key={cellIndex} colSpan={cell.colSpan} rowSpan={cell.rowSpan} scope={rowIndex === 0 ? "col" : undefined}><Blocks blocks={cell.blocks} /></Tag>;
        })}
      </tr>)}</tbody></table>
    </div>;
    return <p key={index} data-source-paragraph={block.sourceIndex} className={block.type === "caption" ? "lab-record-caption" : undefined}>
      {block.prefix && <span className="lab-record-step">{block.prefix}</span>}
      {block.type === "caption" ? <strong><LabRichText runs={block.runs} text={block.text} /></strong> : <LabRichText runs={block.runs} text={block.text} />}
    </p>;
  })}</>;
}

export function NotebookReader({ sections, sourceTitle, sourceTitleRuns }: { sections: Section[]; sourceTitle: string; sourceTitleRuns: LabRun[] }) {
  const pages: Page[] = notebookPages(sections);
  const [active, setActive] = useState<number | null>(null);
  const book = useRef<HTMLElement>(null);
  useEffect(() => {
    const readHash = () => {
      const found = notebookPageForHash(pages, window.location.hash);
      setActive(found < 0 ? 0 : found);
      if (found >= 0) requestAnimationFrame(() => {
        document.getElementById(pages[found].id)?.scrollIntoView({ block: "start" });
      });
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  // Document data stays fixed for this reader's lifetime.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function turn(event: MouseEvent<HTMLAnchorElement>, index: number) {
    // Preserve new-tab/modified clicks, but cancel the normal anchor default
    // before React changes this control's href to the following page.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.location.hash = pages[index].id;
    setActive(index);
    // A single hash navigation preserves refresh, sharing and Back/Forward.
    requestAnimationFrame(() => {
      const heading = document.getElementById(pages[index].id);
      heading?.focus({ preventScroll: true });
      book.current?.scrollIntoView({ block: "start" });
    });
  }
  const current = active ?? 0;
  function controls(position: string) {
    return <nav className="lab-page-controls" aria-label={`Notebook pages, ${position}`}>
      {current > 0 ? <a href={`#${pages[current - 1].id}`} onClick={event => turn(event, current - 1)}>Previous page</a> : <span aria-disabled="true">Previous page</span>}
      <span className="lab-page-count" aria-live="polite" aria-atomic="true">Page {current + 1} / {pages.length}</span>
      {current < pages.length - 1 ? <a href={`#${pages[current + 1].id}`} onClick={event => turn(event, current + 1)}>Next page</a> : <span aria-disabled="true">Next page</span>}
    </nav>;
  }
  return <div className={`lab-notebook-layout${active === null ? "" : " lab-paginated"}`}>
    <nav className="lab-notebook-index" aria-label="Notebook sections">
      {sections.map((section, index) => {
        const target = pages.findIndex(page => page.sectionIndex === index);
        return <a key={section.id} href={`#${section.id}`} onClick={event => turn(event, target)} aria-current={active !== null && pages[current].sectionIndex === index ? "location" : undefined}>
          <span className="lab-entry-date">{section.date}</span><span>{section.title}</span>
        </a>;
      })}
    </nav>
    <article className="lab-notebook-pages" aria-label="Dated laboratory records" ref={book}>
      {pages.map((page, index) => <section className="lab-notebook-entry" key={page.id} hidden={active !== null && current !== index} aria-labelledby={page.id}>
        {index === 0 && <p className="lab-record-source-title" data-source-paragraph={0}><LabRichText runs={sourceTitleRuns} text={sourceTitle} /></p>}
        <header className="lab-record-meta">
        <span className="lab-record-folio" aria-hidden="true">RECORD {String(page.sectionIndex + 1).padStart(2, "0")} · PAGE {index + 1} / {pages.length}</span>
        <h2 id={page.id} tabIndex={-1} data-source-paragraph={page.part === 0 ? sections[page.sectionIndex].sourceIndex : undefined}><LabRichText runs={sections[page.sectionIndex].headingRuns} /></h2>
        {page.part === 0 && <Blocks blocks={page.blocks.filter(block => block.text?.startsWith("Participants:"))} />}
        {page.part > 0 && <div className="lab-page-participants">
          {sections[page.sectionIndex].blocks.filter(block => block.text?.startsWith("Participants:")).map(block =>
            <p key={block.sourceIndex}><LabRichText runs={block.runs} text={block.text} /></p>)}
        </div>}
        </header>
        <Blocks blocks={page.blocks.filter(block => !block.text?.startsWith("Participants:"))} />
      </section>)}
      {active !== null && controls("bottom")}
    </article>
  </div>;
}
