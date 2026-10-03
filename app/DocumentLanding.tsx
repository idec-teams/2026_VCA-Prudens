import { sitePath } from "./site-path";
import "./document-landing.css";

export function DocumentLanding({ slug }: { slug: "safety" | "supplement-files" }) {
  const title = slug === "safety" ? "Safety" : "Supplement Files";
  const icon = slug === "safety" ? "shield-check" : "file-stack";
  return <main className="ppt-deck document-landing" aria-label={title}>
    <section className="document-cover" aria-labelledby="document-title">
      <h1 id="document-title">{title}</h1>
      <img src={sitePath(`/assets/report-20261004/${icon}.svg`)} alt="" />
    </section>
  </main>;
}
