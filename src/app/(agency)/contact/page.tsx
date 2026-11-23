import Link from "next/link";
import { Suspense } from "react";
import CalBookingButton from "../../components/CalBookingButton";
import { pageMetadata } from "../../site-metadata";
import PageIntro from "../PageIntro";
import styles from "../AgencyPages.module.css";
import InquiryForm from "./InquiryForm";

const description = "Contact SparkLab to request a proposal for AI automation, software, websites, or apps. Share your goals and budget or book a discovery call from anywhere.";

export const metadata = pageMetadata("/contact", "Contact & Project Proposals", description);

export default function ContactPage() {
  return (
    <>
      <PageIntro label="Contact SparkLab" heading="Tell Us About Your Project." description="We work with businesses worldwide on AI automation, websites, web and mobile apps, and custom software. Share your requirements to request a proposal, or book a 30-minute discovery call." />

      <div className={styles.contactGrid}>
        <section className={styles.callCard} aria-labelledby="discovery-heading">
          <svg className={styles.calendarIcon} viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect width="48" height="48" rx="15" fill="#fae7d9" />
            <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="13" y="15" width="22" height="20" rx="3" />
              <path d="M13 21h22M19 13v4m10-4v4m-9 11 3 3 5-5" />
            </g>
          </svg>
          <h2 id="discovery-heading">Book a Discovery Call</h2>
          <p>Pick a time to discuss your goals and ask us project questions.</p>
          <dl className={styles.callDetails}>
            <div><dt>Duration</dt><dd>30 minutes</dd></div>
            <div><dt>Meeting</dt><dd>Google Meet</dd></div>
            <div><dt>Timezone</dt><dd>Asia/Dhaka</dd></div>
          </dl>
          <CalBookingButton label="Book a 30-Minute Call" className={styles.callAction} />
        </section>

        <section id="project-inquiry" className={styles.inquiryCard} aria-labelledby="inquiry-heading" tabIndex={-1}>
          <h2 id="inquiry-heading">Send a Project Inquiry</h2>
          <p className={styles.formNote}>Tell us what you want to build or improve and which tools you already use. Include a timeline or budget if you have one.</p>
          <Suspense fallback={<p className={styles.formNote} role="status">Loading inquiry form…</p>}>
            <InquiryForm />
          </Suspense>
        </section>
      </div>

      <div className={styles.returnLinks}>
        <Link className={styles.textLink} href="/"><span aria-hidden="true">←</span> Back to Studio</Link>
        <Link className={styles.textLink} href="/services">Explore software and AI services <span aria-hidden="true">↗</span></Link>
      </div>
    </>
  );
}
