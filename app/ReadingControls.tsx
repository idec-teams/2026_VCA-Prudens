"use client";
import { useEffect, useRef, useState } from "react";
import { sitePath } from "./site-path";

export function ReadingControls() {
  const [progress, setProgress] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(76);
  const [visible, setVisible] = useState(false);
  const frame = useRef(0);
  useEffect(() => {
    const update = () => {
      frame.current = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0);
      setVisible(window.scrollY > 180);
      const header = document.querySelector(".site-header");
      if (header) setHeaderHeight(header.getBoundingClientRect().height);
    };
    const schedule = () => { if (!frame.current) frame.current = requestAnimationFrame(update); };
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    observer?.observe(document.body);
    const header = document.querySelector(".site-header");
    if (header) observer?.observe(header);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => { observer?.disconnect(); cancelAnimationFrame(frame.current); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  return <>
    <div className="reading-progress" style={{ top: headerHeight }} role="progressbar" aria-label="Page reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
      <span className="reading-progress-fill" style={{ transform: `scaleX(${progress})` }} />
      <span className="reading-progress-route"><img src={sitePath("/assets/rna-progress.png")} alt="" style={{ left: `${progress * 100}%` }} /></span>
    </div>
    <button className={`back-to-top${visible ? " is-shown" : ""}`} type="button" aria-label="Back to top" title="Back to top" tabIndex={visible ? 0 : -1} onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}>
      <img src={sitePath("/assets/clover-top.png")} alt="" /><span>↑ TOP</span>
    </button>
  </>;
}
