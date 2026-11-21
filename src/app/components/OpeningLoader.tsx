import styles from "./OpeningLoader.module.css";

export default function OpeningLoader() {
  return <div className={styles.loader} data-opening-loader aria-hidden="true" />;
}
