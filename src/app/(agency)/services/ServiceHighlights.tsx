import shared from "../AgencyPages.module.css";
import styles from "./Services.module.css";

const highlights = [
  { label: "Web", description: "Websites and online stores", path: "M3 5h18v12H3zM3 8h18M8 21h8m-4-4v4" },
  { label: "Apps", description: "iOS and Android apps", path: "M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 15h2" },
  { label: "AI", description: "Workflows and assistants", path: "M3 9h6v6H3zM15 3h6v6h-6zM15 15h6v6h-6zM9 12h3V6h3m-3 6v6h3" },
  { label: "3D", description: "Product visuals and branding", path: "m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9v9m0-9 8-4.5M12 12 4 7.5" },
] as const;

export default function ServiceHighlights() {
  return (
    <section id="platform-statistics" className={`${styles.platformStatistics} ${shared.reveal}`} aria-labelledby="service-highlights-heading">
      <h2 id="service-highlights-heading" className={styles.supportingHeading}>Service Highlights</h2>
      <ul className={styles.statistics} role="list">
        {highlights.map(({ path, label, description }) => (
          <li key={label} className={styles.statistic}>
            <div className={styles.platformLogo} aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={path} />
              </svg>
            </div>
            <strong>{label}</strong>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
