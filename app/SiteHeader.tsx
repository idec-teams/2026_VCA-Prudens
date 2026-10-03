"use client";

import { useEffect, useRef, useState } from "react";
import { sitePath } from "./site-path";

type NavPage = { slug: string; label: string };
type OpenMenu = "team" | "project" | "documents" | "mobile" | null;

export function SiteHeader({ teamPages, projectPages }: { teamPages: NavPage[]; projectPages: NavPage[] }) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("click", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const toggle = (menu: Exclude<OpenMenu, null>) => setOpenMenu((current) => current === menu ? null : menu);
  return (
    <header className="site-header" ref={headerRef}>
      <a className="brand" href={sitePath("/")} aria-label="VCA-Prudens home">
        <img src={sitePath("/assets/idec.png")} alt="iDEC" />
        <span>VCA-Prudens</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href={sitePath("/")}>Home</a>
        <div className={`nav-menu ${openMenu === "team" ? "open" : ""}`}>
          <button className="nav-trigger" type="button" aria-expanded={openMenu === "team"} aria-controls="team-menu" onClick={() => toggle("team")}>Team</button>
          <div className="nav-popover compact" id="team-menu" aria-hidden={openMenu !== "team"}>
            {teamPages.map((page) => <a key={page.slug} href={sitePath(`/${page.slug}`)}>{page.label}</a>)}
          </div>
        </div>
        <div className={`nav-menu ${openMenu === "project" ? "open" : ""}`}>
          <button className="nav-trigger" type="button" aria-expanded={openMenu === "project"} aria-controls="project-menu" onClick={() => toggle("project")}>Project</button>
          <div className="nav-popover" id="project-menu" aria-hidden={openMenu !== "project"}>
            {projectPages.map((page) => <a key={page.slug} href={sitePath(`/${page.slug}`)}>{page.label}</a>)}
          </div>
        </div>
        <div className={`nav-menu ${openMenu === "documents" ? "open" : ""}`}>
          <button className="nav-trigger" type="button" aria-expanded={openMenu === "documents"} aria-controls="documents-menu" onClick={() => toggle("documents")}>Documents</button>
          <div className="nav-popover compact" id="documents-menu" aria-hidden={openMenu !== "documents"}>
            <a href={sitePath("/notebook")}>Notebook</a>
            <a href={sitePath("/protocol")}>Protocol</a>
            <a href={sitePath("/safety")}>Safety</a>
            <a href={sitePath("/supplement-files")}>Supplement Files</a>
          </div>
        </div>
      </nav>
      <div className={`mobile-nav ${openMenu === "mobile" ? "open" : ""}`}>
        <button className="mobile-trigger" type="button" aria-label="Open menu" aria-expanded={openMenu === "mobile"} aria-controls="mobile-menu" onClick={() => toggle("mobile")}>Menu</button>
        <div className="mobile-popover" id="mobile-menu" role="navigation" aria-label="Mobile navigation" aria-hidden={openMenu !== "mobile"}>
          <a href={sitePath("/")}>Home</a>
          <span className="mobile-group">Team</span>
          {teamPages.map((page) => <a key={page.slug} href={sitePath(`/${page.slug}`)}>{page.label}</a>)}
          <span className="mobile-group">Project</span>
          {projectPages.map((page) => <a key={page.slug} href={sitePath(`/${page.slug}`)}>{page.label}</a>)}
          <span className="mobile-group">Documents</span>
          <a href={sitePath("/notebook")}>Notebook</a>
          <a href={sitePath("/protocol")}>Protocol</a>
          <a href={sitePath("/safety")}>Safety</a>
          <a href={sitePath("/supplement-files")}>Supplement Files</a>
        </div>
      </div>
    </header>
  );
}
