import { Fragment } from "react";

// Audited organism names only; do not italicize strain IDs or protein names.
export function scientificNameRanges(text: string) {
  return Array.from(text.matchAll(/\b(?:Escherichia\s+coli|E\.\s*coli|Citrobacter\s+rodentium|C\.\s*rodentium)\b/g),
    match => ({ start: match.index!, end: match.index! + match[0].length }));
}

export function ScientificText({ text = "", ranges = scientificNameRanges(text), offset = 0 }: {
  text?: string;
  ranges?: ReturnType<typeof scientificNameRanges>;
  offset?: number;
}) {
  let cursor = 0;
  const parts = ranges.flatMap(({ start, end }) => {
    const from = Math.max(0, start - offset);
    const to = Math.min(text.length, end - offset);
    if (from >= to) return [];
    const part = <Fragment key={start}>{text.slice(cursor, from)}<i className="scientific-name" style={{ fontStyle: "italic" }}>{text.slice(from, to)}</i></Fragment>;
    cursor = to;
    return [part];
  });
  return <>{parts}{text.slice(cursor)}</>;
}
