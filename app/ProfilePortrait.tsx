import type { CSSProperties } from "react";
import { sitePath } from "./site-path";

export type PhotoCrop = { sourceWidth: number; centerX: number; centerY: number; size: number };

/** Share the face-centered display crop between the roster and dialog. */
export function ProfilePortrait({ image, imageAlt, photoCrop, objectPosition }: {
  image: string; imageAlt: string; photoCrop?: PhotoCrop; objectPosition?: string;
}) {
  const style: CSSProperties = photoCrop ? {
    position: "absolute",
    width: `${photoCrop.sourceWidth / photoCrop.size * 100}%`,
    maxWidth: "none",
    height: "auto",
    left: `${50 - photoCrop.centerX / photoCrop.size * 100}%`,
    top: `${50 - photoCrop.centerY / photoCrop.size * 100}%`,
  } : { objectPosition: objectPosition ?? "center" };
  return <img src={sitePath(image)} alt={imageAlt} style={style} />;
}
