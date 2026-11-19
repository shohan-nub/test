import SiteNav from "../components/SiteNav";
import styles from "./AgencyPages.module.css";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <div className={styles.navSpace}>
        <SiteNav />
      </div>
      <main id="main-content" tabIndex={-1} className={styles.container}>{children}</main>
    </div>
  );
}
