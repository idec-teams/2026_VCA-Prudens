"use client";

import { useEffect, useRef } from "react";
import { sitePath } from "./site-path";

export type ProjectDetailData = {
  slug: string;
  title: string;
  detailTitle: string;
  body?: string;
  sections: Array<{ label: string; lines: string[] }>;
  footer: string;
};

export function ResponsiveProjectPage({ coverSlide, data }: { coverSlide: number; data: ProjectDetailData }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const pages = Array.from(ref.current?.querySelectorAll<HTMLElement>(".ppt-slide") ?? []);
    if (!("IntersectionObserver" in window)) {
      pages.forEach((page) => page.classList.add("is-visible"));
      return;
    }
    ref.current?.classList.add("motion-enabled");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -7% 0px" });
    pages.forEach((page) => observer.observe(page));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="ppt-deck responsive-project" ref={ref} aria-label={`${data.title} presentation pages`}>
      <section className="ppt-slide is-visible" aria-label={`${data.title} cover`}>
        <img src={sitePath(`/slides/slide-${String(coverSlide).padStart(2, "0")}.png`)} alt={`${data.title} cover from the Canva design`} />
      </section>
      <section className="ppt-slide project-detail-slide" aria-label={`${data.title} details`}>
        <aside className="project-outline" aria-label={`${data.title} outline`}>
          {data.sections.map((section) => (
            <div className="outline-block" key={section.label}>
              <h3>{section.label}</h3>
              {section.lines.map((line) => <p key={line}>{line}</p>)}
            </div>
          ))}
          <h3 className="outline-footer">{data.footer}</h3>
        </aside>
        <article className="project-copy-card">
          <h1>{data.title}</h1>
          <div className="project-copy-inner">
            <h2>{data.detailTitle}</h2>
            {data.body && <p>{data.body}</p>}
          </div>
        </article>
      </section>
    </main>
  );
}
