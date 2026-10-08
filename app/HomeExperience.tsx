"use client";
import { useEffect, useState } from "react";
import { sitePath } from "./site-path";

export function HomeExperience() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const page = document.querySelector(".home-page");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let frame = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const images: HTMLImageElement[] = [];
    const stop = () => { cancelAnimationFrame(frame); if (!cancelled) setLoading(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") stop(); };
    const preference = () => { if (reduced.matches) { stop(); setPaused(true); } };
    preference();
    reduced.addEventListener("change", preference);
    if (!reduced.matches) {
      setLoading(true);
      const start = performance.now();
      let complete = 0;
      let target = 0;
      const settled = () => { target = Math.round(++complete / 3 * 100); };
      const drawProgress = () => {
        if (cancelled) return;
        const shown = Math.min(target, Math.floor((performance.now() - start) / 10));
        setProgress(shown);
        if (shown < 100) frame = requestAnimationFrame(drawProgress);
      };
      frame = requestAnimationFrame(drawProgress);
      const tasks = ["/assets/home-20261005/clover-loading.jpg", "/assets/iscro4-bridge.webp"].map(src => new Promise<void>(resolve => {
        const image = new Image(); images.push(image);
        image.onload = image.onerror = () => resolve(); image.src = sitePath(src);
      }).then(settled));
      tasks.push(document.fonts.ready.then(settled));
      Promise.all(tasks).then(() => { if (!cancelled) timers.push(setTimeout(stop, Math.max(0, 1100 - (performance.now() - start)))); });
      // Never hold up navigation if a resource or the network stalls.
      timers.push(setTimeout(stop, 3500));
      window.addEventListener("keydown", escape);
    }
    page?.classList.add("home-motion-ready");
    return () => { cancelled = true; cancelAnimationFrame(frame); timers.forEach(clearTimeout); images.forEach(image => { image.onload = image.onerror = null; }); window.removeEventListener("keydown", escape); reduced.removeEventListener("change", preference); page?.classList.remove("home-motion-ready"); };
  }, []);
  useEffect(() => {
    document.querySelector(".home-page")?.classList.toggle("motion-paused", paused);
    if (paused) document.querySelectorAll(".home-reveal").forEach(element => element.classList.add("home-revealed"));
  }, [paused]);
  useEffect(() => {
    const page = document.querySelector(".home-page");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!page || reduced.matches || !("IntersectionObserver" in window)) return;
    // Progressive enhancement: content stays readable without JS or motion.
    const elements = [...page.querySelectorAll<HTMLElement>(
      ".home-hero-copy > :not([aria-hidden]), .home-hero-art, .hero-keywords, .story-section > :not([aria-hidden]), .story-footer > *"
    )];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting || reduced.matches || page.classList.contains("motion-paused") || entry.target.contains(document.activeElement)) {
          entry.target.classList.add("home-revealed");
        } else {
          // Reset only after leaving the viewport, so either scroll direction replays.
          // Move away from the nearest edge to avoid an observer/transform feedback loop.
          (entry.target as HTMLElement).style.setProperty("--reveal-offset", entry.boundingClientRect.bottom <= 0 ? "-38px" : "38px");
          entry.target.classList.remove("home-revealed");
        }
      });
    }, { threshold: 0 });
    elements.forEach((element, index) => {
      // Don't hide already visible content on hydration or a restored scroll.
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) element.classList.add("home-revealed");
      element.style.setProperty("--reveal-delay", `${index % 2 * 90}ms`);
      element.classList.add("home-reveal");
      observer.observe(element);
    });
    const revealAll = () => {
      elements.forEach(element => element.classList.add("home-revealed"));
      observer.disconnect();
    };
    const preference = () => { if (reduced.matches) revealAll(); };
    const focus = (event: Event) => {
      (event.target as Element)?.closest(".home-reveal")?.classList.add("home-revealed");
    };
    page.addEventListener("focusin", focus);
    reduced.addEventListener("change", preference);
    return () => {
      observer.disconnect();
      page.removeEventListener("focusin", focus);
      reduced.removeEventListener("change", preference);
      elements.forEach(element => { element.classList.remove("home-reveal", "home-revealed"); element.style.removeProperty("--reveal-delay"); element.style.removeProperty("--reveal-offset"); });
    };
  }, []);
  return <>
    <button className="home-motion-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume motion" : "Pause motion"}</button>
    {loading && <div className="home-loader">
      <div className="loader-orbit"><img src={sitePath("/assets/home-20261005/clover-loading.jpg")} alt="VCA-Prudens clover mascot" /><span aria-hidden="true" /></div>
      <p>VCA-Prudens</p>
      <div className="loader-progress" role="progressbar" aria-label="Homepage assets loaded" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
      <strong className="loader-percentage">{progress}%</strong>
      <button type="button" onClick={() => setLoading(false)}>Skip intro →</button>
    </div>}
  </>;
}
