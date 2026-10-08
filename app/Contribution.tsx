import data from "./contribution-data.json";
import { sitePath } from "./site-path";
import "./contribution.css";
import { PageHero } from "./PageHero";

export function Contribution() {
  return <main className="ppt-deck contribution-page">
    <PageHero title="Attribution" image="/assets/contribution.webp" />
    <div className="contribution-content">
      <div className="contribution-table-shell">
        <div className="contribution-table-scroll" tabIndex={0} role="region" aria-label="Team attribution table — scroll to view all columns and members">
          <table className="contribution-table">
            <caption className="contribution-sr-only">Team attribution</caption>
            <thead><tr><th scope="col">{data.memberHeading}</th>{data.columns.map(column => <th scope="col" key={column.id}>{column.label}</th>)}</tr></thead>
            <tbody>{data.members.map(member => <tr key={member.name}>
              <th scope="row">{member.name}</th>
              {data.columns.map(column => <td key={column.id} data-member={member.name} data-role={column.id}>
                {member.roles.includes(column.id) && <img className="contribution-flower" src={sitePath("/assets/contribution-20261004/flower-hd.png")} alt="Attributed" width={40} height={40} />}
              </td>)}
            </tr>)}</tbody>
          </table>
        </div>
      </div>
      <header className="contribution-guidance-intro">
        <p className="guidance-eyebrow">SCIENTIFIC MENTORSHIP</p>
        <h2>Support across the research process</h2>
        <p>Our work on Biomni-assisted ISCro4 directed evolution combined literature evaluation, plasmid and mutant construction, qPCR-based activity screening, and interpretation of the results. Our supervisor and advisors helped the team assess AI-generated recommendations, refine experimental approaches, and communicate the evidence clearly. Their individual Attributions are outlined below.</p>
      </header>
      <div className="contribution-guidance">
        {data.guidance.map((section, index) => <section key={section.heading} className="guidance-section" aria-labelledby={`contribution-guidance-${index}`}>
          <h2 id={`contribution-guidance-${index}`}>{section.heading}</h2>
          <p>{section.text}</p>
        </section>)}
      </div>
    </div>
  </main>;
}
