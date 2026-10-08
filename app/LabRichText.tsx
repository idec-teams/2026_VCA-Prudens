import { Fragment } from "react";
import { ScientificText, scientificNameRanges } from "./ScientificText";

export type LabRun = { text: string; bold: boolean };

// Keep Word's emphasis boundaries without changing any characters or spacing.
export function LabRichText({ runs, text }: { runs?: LabRun[]; text?: string }) {
  if (!runs) return <ScientificText text={text} />;
  const ranges = scientificNameRanges(runs.map(run => run.text).join(""));
  let offset = 0;
  return <>{runs.map((run, index) => {
    const content = <ScientificText text={run.text} ranges={ranges} offset={offset} />;
    offset += run.text.length;
    return run.bold
      ? <strong className="lab-source-bold" key={index}>{content}</strong>
      : <Fragment key={index}>{content}</Fragment>;
  })}</>;
}
