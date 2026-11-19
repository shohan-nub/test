import type { ReactNode } from "react";
import styles from "./AgencyPages.module.css";

export default function PageIntro({ label, heading, description, children }: {
  label: string;
  heading: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className={styles.intro}>
      <p className={styles.eyebrow}>{label}</p>
      <h1>{heading}</h1>
      <p className={styles.introCopy}>{description}</p>
      {children}
    </header>
  );
}
