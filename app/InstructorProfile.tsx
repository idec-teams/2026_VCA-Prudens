"use client";

import { useCallback, useState } from "react";
import { ProfileModal, type TeamProfile } from "./ProfileModal";
import { supervisor, MemberCard } from "./TeamMembers";

export function InstructorProfile() {
  const [selected, setSelected] = useState<TeamProfile | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);
  return (
    <main className="team-members-page supervisor-page">
      <h1>Team Supervisor</h1>
      <div className="supervisor-card-wrap">
        <MemberCard member={supervisor} onSelect={setSelected} />
      </div>
      <p className="profile-open-hint">Select the profile to read more</p>
      <ProfileModal profile={selected} onClose={closeModal} />
    </main>
  );
}
