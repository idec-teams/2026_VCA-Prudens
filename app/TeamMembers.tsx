"use client";
import { useCallback, useState } from "react";
import { ProfileModal, type TeamProfile } from "./ProfileModal";
import profiles from "./team-profiles.json";
import { ProfilePortrait } from "./ProfilePortrait";

const people = profiles as TeamProfile[];
export const supervisor = people.find(person => person.role === "SUPERVISOR")!;
const leaderOrder = ["Zimeng Jessie, Yu", "Kele, Zhang", "Lifei, Shu", "Shiya, Da"];
export const teamLeaders = leaderOrder.map(name => people.find(person => person.name === name)!);
export const teamMembers = people.filter(person => person.role === "TEAM MEMBER");

export function MemberCard({ member, onSelect }: { member: TeamProfile; onSelect: (member: TeamProfile) => void }) {
  return <button className="member-card" type="button" onClick={() => onSelect(member)} aria-label={`Open ${member.name} profile`}>
    <span className="member-photo"><ProfilePortrait {...member} /></span>
    <strong>{member.name}</strong>
    <span className="member-divider" aria-hidden="true" />
    <span className="member-role">{member.role}</span>
    <span className="member-team">VCA-Prudens</span>
  </button>;
}
export function TeamMembers() {
  const [selected, setSelected] = useState<TeamProfile | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);
  return <main className="team-members-page">
    <section className="team-roster-group" aria-labelledby="supervisor-heading">
      <h1 id="supervisor-heading">Supervisor</h1>
      <div className="team-member-grid supervisor-row"><MemberCard member={supervisor} onSelect={setSelected} /></div>
    </section>
    <section className="team-roster-group" aria-labelledby="leaders-heading">
      <h2 id="leaders-heading">Team Leaders</h2>
      <div className="team-member-grid">{teamLeaders.map(member => <MemberCard key={member.name} member={member} onSelect={setSelected} />)}</div>
    </section>
    <section className="team-roster-group" aria-labelledby="members-heading">
      <h2 id="members-heading">Team Members</h2>
      <div className="team-member-grid">{teamMembers.map(member => <MemberCard key={member.name} member={member} onSelect={setSelected} />)}</div>
    </section>
    <ProfileModal profile={selected} onClose={closeModal} />
  </main>;
}
