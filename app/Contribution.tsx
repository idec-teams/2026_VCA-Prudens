import data from "./contribution-data.json";
import { sitePath } from "./site-path";
import "./contribution.css";
import { PageHero } from "./PageHero";

export function Contribution() {
  return <main className="ppt-deck contribution-page">
    <PageHero title="Contribution" image="/assets/contribution.webp" />
    <div className="contribution-content">
      <div className="contribution-table-shell">
        <div className="contribution-table-scroll" tabIndex={0} role="region" aria-label="Team contribution table — scroll to view all columns and members">
          <table className="contribution-table">
            <caption className="contribution-sr-only">Team contribution</caption>
            <thead><tr><th scope="col">{data.memberHeading}</th>{data.columns.map(column => <th scope="col" key={column.id}>{column.label}</th>)}</tr></thead>
            <tbody>{data.members.map(member => <tr key={member.name}>
              <th scope="row">{member.name}</th>
              {data.columns.map(column => <td key={column.id} data-member={member.name} data-role={column.id}>
                {member.roles.includes(column.id) && <img className="contribution-flower" src={sitePath(data.flower)} alt="Contributed" width={40} height={40} />}
              </td>)}
            </tr>)}</tbody>
          </table>
        </div>
      </div>
      <div className="contribution-guidance">
        {data.guidance.map((section, index) => <section key={section.heading} className="guidance-section" aria-labelledby={`contribution-guidance-${index}`}>
          <h2 id={`contribution-guidance-${index}`}>{section.heading}</h2>
          <p>{section.text}</p>
        </section>)}
      </div>
    </div>
  </main>;
}
