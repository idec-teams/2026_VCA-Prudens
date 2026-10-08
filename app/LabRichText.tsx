import { Fragment } from "react";

export type LabRun = { text: string; bold: boolean };

// Keep Word's emphasis boundaries without changing any characters or spacing.
export function LabRichText({ runs, text }: { runs?: LabRun[]; text?: string }) {
  if (!runs) return <>{text}</>;
  return <>{runs.map((run, index) => run.bold
    ? <strong className="lab-source-bold" key={index}>{run.text}</strong>
    : <Fragment key={index}>{run.text}</Fragment>)}</>;
}
