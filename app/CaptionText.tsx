import { ScientificText, scientificNameRanges } from "./ScientificText";

/** Emphasize the title sentence without changing any source text or punctuation. */
export function CaptionText({ text }: { text: string }) {
  const label = text.match(/^(?:Fig(?:ure)?\.?|Table)\s*(?:\d+[A-Za-z]?\.?\s*)?/i)?.[0] ?? "";
  const end = text.slice(label.length).search(/[.!?](?=\s|$)/);
  const boundary = end < 0 ? text.length : label.length + end + 1;
  const ranges = scientificNameRanges(text);
  return <><strong><ScientificText text={text.slice(0, boundary)} ranges={ranges} /></strong><ScientificText text={text.slice(boundary)} ranges={ranges} offset={boundary} /></>;
}
