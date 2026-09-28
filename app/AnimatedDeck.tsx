"use client";

import { useEffect, useRef } from "react";
import { sitePath } from "./site-path";

export function AnimatedDeck({ slides, title }: { slides: number[]; title: string }) {
  const deckRef = useRef<HTMLElement>(null);

  useEffect(() => {
    deckRef.current?.classList.add("motion-enabled");
    const elements = Array.from(deckRef.current?.querySelectorAll<HTMLElement>(".ppt-slide") ?? []);
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="ppt-deck" ref={deckRef} aria-label={`${title} presentation pages`}>
      {slides.map((slide, index) => (
        <section
          className={`ppt-slide ${index === 0 ? "is-visible" : ""}`}
          id={`slide-${slide}`}
          key={slide}
          aria-label={`${title}, slide ${index + 1} of ${slides.length}`}
        >
          <img
            src={sitePath(`/slides/slide-${String(slide).padStart(2, "0")}.png`)}
            alt={`${title} — source presentation slide ${slide}`}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </section>
      ))}
    </main>
  );
}
