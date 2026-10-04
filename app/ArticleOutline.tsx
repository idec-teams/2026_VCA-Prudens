"use client";

import { useEffect, useState } from "react";

type Section = { id: string; title: string; children?: Section[] };

export function ArticleOutline({ title, sections }: { title: string; sections: Section[] }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const revealHash = () => {
      if (sections.some(section => section.children?.some(child => window.location.hash === `#${child.id}`))) setExpanded(true);
    };
    revealHash();
    window.addEventListener("hashchange", revealHash);
    return () => window.removeEventListener("hashchange", revealHash);
  }, [sections]);
  return <nav className="project-outline wiki-article-outline" aria-label={`${title} sections`}>
    {sections.map(section => section.children ? <div className="outline-group" key={section.id}>
      <div className="outline-parent">
        <a href={`#${section.id}`}>{section.title}</a>
        <button type="button" aria-label={`${expanded ? "Collapse" : "Expand"} ${section.title} subsections`} aria-expanded={expanded} aria-controls={`outline-${section.id}`} onClick={() => setExpanded(!expanded)}>{expanded ? "−" : "+"}</button>
      </div>
      <div className="outline-children" id={`outline-${section.id}`} hidden={!expanded}>
        {section.children.map(child => <a key={child.id} href={`#${child.id}`}>{child.title}</a>)}
      </div>
    </div> : <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
  </nav>;
}
