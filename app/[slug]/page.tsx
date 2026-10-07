import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, SlideDeck } from "../WikiShell";
import { allPages, pageBySlug, type SlidePage } from "../wiki-data";
import { InstructorProfile } from "../InstructorProfile";
import { TeamMembers } from "../TeamMembers";
import { ResponsiveProjectPage, type ProjectDetailData } from "../ResponsiveProjectPage";
import { WikiArticle } from "../WikiArticle";
import { PaperArticle, paperSlugs } from "../PaperArticle";
import { ReportArticle, reportSlugs } from "../ReportArticle";
import { DocumentLanding } from "../DocumentLanding";
import { Contribution } from "../Contribution";
import { LabDocuments } from "../LabDocuments";

const projectDetails: Record<string, ProjectDetailData> = {
  description: {
    slug: "description", title: "Why ISCro4?", detailTitle: "Project Overview",
    body: "CRISPR excels at small edits but struggles with programmable gene-sized rearrangements. ISCro4 uses bridge RNA to recognize target and donor DNA, enabling insertion, deletion, or inversion without HDR. We aim to improve its low activity in E. coli.",
    sections: [
      { label: "Background", lines: ["Large-fragment insertion", "remains a major bottleneck."] },
      { label: "Current Limitations", lines: ["DSB repair, fixed sites,", "or low cellular efficiency."] },
      { label: "Core Question", lines: ["Can MM168 be improved in E. coli?"] },
    ], footer: "References",
  },
  design: {
    slug: "design", title: "A Dual-Track Design", detailTitle: "Design Logic",
    body: "Protein engineering and host optimization are tested in parallel. Beneficial mutations from Track A and accessory-protein conditions from Track B are evaluated independently, then combined. Inversion-specific qPCR reveals whether their effects are additive, synergistic, or antagonistic.",
    sections: [
      { label: "Starting Point", lines: ["MM168 combines S30T,", "P54Q, and S243H."] },
      { label: "Dual Tracks", lines: ["Track A: mutations", "Track B: host factors"] },
      { label: "Goal", lines: ["Target: ≥2× MM168 activity."] },
    ], footer: "References",
  },
  model: {
    slug: "model", title: "DMS-Guided Selection Model", detailTitle: "Selection Logic",
    body: "This model is a transparent evidence-ranking framework rather than an AI predictor. DMS activity, residue location, structural plausibility, and compatibility with MM168 are combined to prioritize candidates. Experimental qPCR remains the final validation step.",
    sections: [
      { label: "Inputs", lines: ["Published DMS activity", "plus structural context"] },
      { label: "Ranking Filters", lines: ["Exclude MM168 sites", "and risky substitutions"] },
      { label: "Validation", lines: ["Confirm candidates by qPCR."] },
    ], footer: "References",
  },
  engineering: {
    slug: "engineering", title: "An Iterative Engineering Cycle", detailTitle: "Engineering Logic",
    body: "Each round follows Design–Build–Test–Learn. Candidate substitutions and host factors are selected, constructed, sequence-verified, and measured with the same inversion assay. Only reproducible improvements advance to combination testing, allowing epistasis to guide the next cycle.",
    sections: [
      { label: "Design & Build", lines: ["Select candidates", "and construct variants"] },
      { label: "Test", lines: ["Measure against WT", "and MM168 controls"] },
      { label: "Iterate", lines: ["Stack only reproducible gains"] },
    ], footer: "References",
  },
  experiment: {
    slug: "experiment", title: "Inversion Assay Workflow", detailTitle: "Experimental Plan",
    body: "MM168-derived variants are built by site-directed mutagenesis and confirmed by Sanger sequencing. E. coli receives ISCro4, reporter, and optional accessory plasmids. Inversion-specific qPCR compares activity with WT, MM168, negative, mismatch, catalytic-dead, and empty-vector controls.",
    sections: [
      { label: "Construction", lines: ["Mutagenesis, DpnI,", "Sanger verification"] },
      { label: "Assay", lines: ["Co-transform, induce,", "extract, and run qPCR"] },
      { label: "Statistics", lines: ["3 biological × 3 technical replicates"] },
    ], footer: "References",
  },
  analysis: {
    slug: "analysis", title: "Candidate Prioritization", detailTitle: "Selection Strategy",
    body: "Published DMS activity provides the first ranking signal. Candidates overlapping MM168 are removed, and the remaining substitutions are filtered for structural plausibility and compatibility with the triple mutant. Ten candidates will advance to single-variant testing before beneficial changes are stacked.",
    sections: [
      { label: "DMS Evidence", lines: ["Positive fold-change", "defines initial candidates"] },
      { label: "Structural Filter", lines: ["Remove MM168 sites", "and implausible changes"] },
      { label: "Shortlist", lines: ["Advance 10 candidates to testing"] },
    ], footer: "References",
  },
  results: {
    slug: "results", title: "Wet-Lab Results Framework", detailTitle: "Reporting Plan",
    sections: [
      { label: "Baselines", lines: ["Report WT and MM168", "inversion efficiencies"] },
      { label: "Track A & Track B", lines: ["Compare mutations", "and accessory factors"] },
      { label: "Combined", lines: ["Test the best combined condition"] },
    ], footer: "Statistics",
  },
  contribution: {
    slug: "contribution", title: "Attribution", detailTitle: "Attribution Overview",
    body: "VCA-Prudens establishes a practical framework for improving ISCro4 in E. coli through mutation stacking and host optimization. The project connects human-cell DMS evidence with bacterial validation, develops a qPCR-centered workflow, and documents a strategy adaptable to other bridge recombinases.",
    sections: [
      { label: "Scientific", lines: ["Cross-host validation", "of DMS mutations"] },
      { label: "Technical", lines: ["Host-factor strategy", "plus qPCR workflow"] },
      { label: "Educational", lines: ["Accessible directed evolution"] },
    ], footer: "Team",
  },
};

export function generateStaticParams() {
  return [...allPages.map((page) => ({ slug: page.slug })), { slug: "mutation-selection" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = slug === "mutation-selection" ? "analysis" : slug;
  const page = pageBySlug[canonicalSlug] as SlidePage | undefined;
  return {
    title: page ? `${page.title} | VCA-Prudens` : "VCA-Prudens",
    description: page ? `${page.title}, reproduced faithfully from the VCA-Prudens project presentation.` : "VCA-Prudens iDEC wiki.",
  };
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canonicalSlug = slug === "mutation-selection" ? "analysis" : slug;
  const page = pageBySlug[canonicalSlug] as SlidePage | undefined;
  if (!page) notFound();
  const detail = projectDetails[canonicalSlug];
  return (
    <>
      <Header />
      {canonicalSlug === "contribution" ? (
        <Contribution />
      ) : canonicalSlug === "description" ? (
        <WikiArticle slug={canonicalSlug} />
      ) : reportSlugs.includes(canonicalSlug) ? (
        <ReportArticle slug={canonicalSlug} />
      ) : canonicalSlug === "notebook" || canonicalSlug === "protocol" ? (
        <LabDocuments slug={canonicalSlug} />
      ) : canonicalSlug === "safety" || canonicalSlug === "supplement-files" ? (
        <DocumentLanding slug={canonicalSlug} />
      ) : paperSlugs.includes(canonicalSlug) ? (
        <PaperArticle slug={canonicalSlug} />
      ) : detail ? (
        <ResponsiveProjectPage coverSlide={page.slides[0]} data={detail} />
      ) : canonicalSlug === "members" ? (
        <TeamMembers />
      ) : canonicalSlug === "descriptions" ? (
        <InstructorProfile />
      ) : (
        <SlideDeck slides={page.slides} title={page.title} />
      )}
    </>
  );
}
