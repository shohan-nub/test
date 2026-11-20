import Image from "next/image";
import shared from "../AgencyPages.module.css";
import styles from "./Services.module.css";

const statistics = [
  { logo: "clutch.webp", width: 293, height: 330, value: "49+", description: "Client Reviews on Clutch.co" },
  { logo: "behance.svg", width: 24, height: 24, value: "50+", description: "Feature Project on Behance" },
  { logo: "fiverr.svg", width: 96, height: 30, value: "225+", description: "Client Reviews on Fiverr" },
  { logo: "dribbble.svg", width: 24, height: 24, value: "3.5M+", description: "Monthly View on Dribbble" },
] as const;

export default function PlatformStatistics() {
  return (
    <section id="platform-statistics" className={shared.reveal} aria-labelledby="platform-statistics-heading">
      <h2 id="platform-statistics-heading" className={styles.supportingHeading}>Platform Statistics</h2>
      <ul className={styles.statistics} role="list">
        {statistics.map(({ logo, width, height, value, description }) => (
          <li key={logo} className={styles.statistic}>
            <Image className={styles.platformLogo} src={`/brands/${logo}`} alt="" width={width} height={height} />
            <strong>{value}</strong>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
