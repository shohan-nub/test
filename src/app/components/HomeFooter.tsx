import Image from "next/image";
import { brandLogo } from "./brand";
import { CopyrightYear, FooterEffects } from "./FooterEffects";
import FooterRouteLink from "./FooterRouteLink";
import styles from "./HomeFooter.module.css";

export default function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <FooterRouteLink className={styles.logo} href="/" aria-label="SparkLab home">
            <Image {...brandLogo} alt="SparkLab" sizes="150px" />
          </FooterRouteLink>
          <p className={styles.description}>Building digital experiences and intelligent solutions for businesses without boundaries.</p>
          <div className={styles.details}>
            <nav aria-label="Footer navigation">
              <h2>Explore</h2>
              <ul>
                <li><FooterRouteLink href="/">Studio</FooterRouteLink></li>
                <li><FooterRouteLink href="/services">Services</FooterRouteLink></li>
                <li><FooterRouteLink href="/about">About Us</FooterRouteLink></li>
                <li><FooterRouteLink href="/contact">Contact Us</FooterRouteLink></li>
              </ul>
            </nav>
            <div>
              <h2>Locations</h2>
              <ul><li>Dhaka, Bangladesh</li><li>Mymensingh, Bangladesh</li></ul>
            </div>
          </div>
          <a className={styles.email} href="mailto:heysparklab@gmail.com">
            <span>Email SparkLab</span>
            <strong>heysparklab@gmail.com</strong>
            <span className={styles.emailArrow} aria-hidden="true">↗</span>
          </a>
        </div>
        <FooterEffects />
      </div>
      <div className={styles.bottom}>© <CopyrightYear /> SparkLab</div>
    </footer>
  );
}
