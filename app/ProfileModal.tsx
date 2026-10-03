"use client";

import { useEffect, useRef } from "react";
import { ProfilePortrait, type PhotoCrop } from "./ProfilePortrait";

export type TeamProfile = {
  name: string;
  role: "TEAM MEMBER" | "TEAM LEADER" | "ADVISOR" | "SUPERVISOR";
  image: string;
  imageAlt: string;
  bio: string;
  affiliation?: string;
  objectPosition?: string;
  photoCrop?: PhotoCrop;
};

export function ProfileModal({ profile, onClose }: { profile: TeamProfile | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!profile) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [profile, onClose]);

  if (!profile) return null;
  const titleId = `profile-${profile.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="profile-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button ref={closeRef} className="profile-modal-close" type="button" onClick={onClose} aria-label={`Close ${profile.name} profile`}>
          <span aria-hidden="true">×</span>
        </button>
        <div className="profile-modal-copy">
          <p className="profile-modal-eyebrow">{profile.role === "SUPERVISOR" ? "TEAM SUPERVISOR" : profile.role}</p>
          <h2 id={titleId}><span aria-hidden="true">│</span>{profile.name}</h2>
          <div className="profile-modal-meta">
            <p>{profile.affiliation ?? (profile.role === "TEAM LEADER" ? "iDEC Team Leader" : profile.role === "ADVISOR" ? "iDEC Team Advisor" : "iDEC Team Member")}<br />VCA-Prudens</p>
          </div>
          <div className="profile-modal-about">
            <span aria-hidden="true" />
            <h3>ABOUT</h3>
            <p>{profile.bio}</p>
          </div>
        </div>
        <div className="profile-modal-photo">
          <ProfilePortrait {...profile} />
        </div>
      </section>
    </div>
  );
}
