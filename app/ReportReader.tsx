"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { sitePath } from "./site-path";
import "./report-reader.css";

const pages = Array.from({ length: 14 }, (_, index) => index + 1);
const assetRoot = "/assets/report-20261008/";
const pdf = assetRoot + "vca-prudens-2026-idec-report.pdf";
const pageImage = (page: number, thumbnail = false) => sitePath(assetRoot + (thumbnail ? "thumb-" : "page-") + String(page).padStart(2, "0") + "-hd.webp");

export function ReportReader() {
  const [active, setActive] = useState<number | null>(null);
  const reader = useRef<HTMLDivElement>(null);
  const current = active ?? 1;
  useEffect(() => {
    const read = () => {
      const match = window.location.hash.match(/^#report-page-(\d+)$/);
      const page = Number(match?.[1]);
      setActive(pages.includes(page) ? page : 1);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  function turn(event: MouseEvent<HTMLAnchorElement>, page: number) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setActive(page);
    window.location.hash = "report-page-" + page;
    requestAnimationFrame(() => reader.current?.scrollIntoView({ block: "start" }));
  }
  return <main className="report-library">
    <header className="report-library-heading">
      <div><p className="report-eyebrow">VCA-PRUDENS · iDEC 2026</p><h1>Report</h1><p className="report-library-summary">From Curiosity to Catalyst: How an AI Agent Enabled a High School Team to Evolve a Better ISCro4 Recombinase</p></div>
      <div className="report-edition"><span>RESEARCH ARCHIVE</span><strong>14</strong><span>PAGES · ORIGINAL PDF</span></div>
    </header>
    <div className="report-reader" ref={reader}>
      <div className="report-toolbar">
        <div><span className="report-status-dot" aria-hidden="true" /><strong>Research report</strong><span className="report-format">PDF · 6.5 MB</span></div>
        <div className="report-actions"><a href={sitePath(pdf)} target="_blank" rel="noopener noreferrer">Open original PDF ↗</a><a href={sitePath(pdf)} download>Download ↓</a></div>
      </div>
      <div className="report-workspace">
        <nav className="report-page-rail" aria-label="Report page thumbnails">
          {pages.map(page => <a key={page} href={"#report-page-" + page} onClick={event => turn(event, page)} aria-label={"Go to report page " + page} aria-current={active === page ? "page" : undefined}><img src={pageImage(page, true)} alt="" loading="lazy" width={184} height={260} /><span>{String(page).padStart(2, "0")}</span></a>)}
        </nav>
        <div className="report-paper-stack">
          {pages.map(page => <figure className="report-sheet" key={page} id={"report-page-" + page} hidden={active !== null && page !== active}>
            <img src={pageImage(page)} width={910} height={1287} alt={"Original iDEC report, page " + page + " of 14. Open the original PDF for selectable text and full-resolution figures."} loading={page === current ? "eager" : "lazy"} />
            <figcaption>VCA-Prudens · iDEC 2026 <span>{page} / 14</span></figcaption>
          </figure>)}
          {active !== null && <nav className="report-pagination" aria-label="Report pages">
            {current > 1 ? <a href={"#report-page-" + (current - 1)} onClick={event => turn(event, current - 1)}>← Previous</a> : <span aria-disabled="true">← Previous</span>}
            <span aria-live="polite" aria-atomic="true">Page {current} / 14</span>
            {current < 14 ? <a href={"#report-page-" + (current + 1)} onClick={event => turn(event, current + 1)}>Next →</a> : <span aria-disabled="true">Next →</span>}
          </nav>}
        </div>
      </div>
    </div>
  </main>;
}
