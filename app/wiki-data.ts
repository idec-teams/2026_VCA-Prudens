export type SlidePage = {
  slug: string;
  label: string;
  title: string;
  slides: number[];
};

export const projectPages: SlidePage[] = [
  { slug: "description", label: "Description", title: "Description", slides: [14, 15] },
  { slug: "design", label: "Design", title: "Design", slides: [16, 17] },
  { slug: "methods", label: "Methods", title: "Methods", slides: [] },
  { slug: "engineering", label: "Engineering", title: "Engineering", slides: [20, 21] },
  { slug: "results", label: "Results", title: "Results", slides: [26, 27] },
  { slug: "analysis", label: "Analysis", title: "Analysis", slides: [24, 25] },
  { slug: "model", label: "Model", title: "Model", slides: [18, 19] },
  { slug: "experiment", label: "Experiment", title: "Experiment", slides: [22, 23] },
];

export const teamPages: SlidePage[] = [
  { slug: "team", label: "Overview", title: "Team", slides: [7] },
  { slug: "members", label: "Members", title: "Members", slides: [10] },
  { slug: "contribution", label: "Contribution", title: "Contribution", slides: [28, 29] },
  { slug: "descriptions", label: "Instructors", title: "Team Supervisor", slides: [8] },
  { slug: "attributions", label: "Attributions", title: "Attributions", slides: [12] },
  { slug: "work-distribution", label: "Work Distribution", title: "Work Distribution", slides: [13] },
];

export const teamNavPages = teamPages.filter((page) => ["members", "contribution"].includes(page.slug));

export const documentPages: SlidePage[] = [
  { slug: "notebook", label: "Notebook", title: "Notebook", slides: [31, 32] },
  { slug: "protocol", label: "Protocol", title: "Protocol", slides: [33] },
  { slug: "safety", label: "Safety", title: "Safety", slides: [] },
  { slug: "supplement-files", label: "Supplement Files", title: "Supplement Files", slides: [] },
];

export const allPages = [...teamPages, ...projectPages, ...documentPages];
export const pageBySlug = Object.fromEntries(allPages.map((page) => [page.slug, page]));
