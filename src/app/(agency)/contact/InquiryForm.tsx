"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { contactBudgets, contactTimelines, findService, services } from "../../services-data";
import styles from "../AgencyPages.module.css";

export default function InquiryForm() {
  const searchParams = useSearchParams();
  const selectedService = findService(searchParams.get("service"))?.id ?? "";
  const sendingRef = useRef(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string }>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    sendingRef.current = true;
    setSending(true);
    setNotice(undefined);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind: "project-inquiry" }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        setNotice({ type: "error", message: typeof result.error === "string" ? result.error : "Your inquiry couldn’t be sent. Please try again." });
        return;
      }
      form.reset();
      setNotice({ type: "success", message: "Your project inquiry was sent. Thanks for getting in touch." });
    } catch {
      setNotice({ type: "error", message: "Your inquiry couldn’t be sent. Please try again." });
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  return (
    <form className={styles.form} method="post" onSubmit={submit} aria-describedby="inquiry-required">
      <p id="inquiry-required" className={styles.formNote}>Name, work email, project subject, service and project details are required.</p>
      <div className={styles.formFields}>
        <label>Full Name <input name="name" autoComplete="name" required maxLength={100} /></label>
        <label>Work Email <input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label className={styles.fullField}>Company / Business Name <input name="company" autoComplete="organization" maxLength={150} /></label>
        <label className={styles.fullField}>Project Subject <input name="subject" required maxLength={160} /></label>
        <label>Service Required
          <select key={selectedService} name="service" defaultValue={selectedService} required>
            <option value="" disabled>Select a service</option>
            {services.map(service => <option key={service.id} value={service.id}>{({"ai-automation": "AI Automation", "seo-geo": "SEO & GEO", "custom-software": "Custom Software"} as Record<string, string>)[service.id] ?? service.title}</option>)}
            <option value="other">Other</option>
          </select>
        </label>
        <label>Estimated Budget
          <select name="budget" defaultValue="">
            <option value="">Select a range (optional)</option>
            {contactBudgets.map(budget => <option key={budget.id} value={budget.id}>{budget.label}</option>)}
          </select>
        </label>
        <label className={styles.fullField}>Expected Timeline
          <select name="timeline" defaultValue=""><option value="">Select a timeline (optional)</option>{contactTimelines.map(timeline => <option key={timeline} value={timeline}>{timeline}</option>)}</select>
        </label>
        <label className={styles.fullField}>Project Details <textarea name="message" rows={5} required maxLength={5000} /></label>
      </div>
      <div className={styles.trap} aria-hidden="true"><label>Leave this field blank <input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.button} disabled={sending}>
          {sending ? "Sending…" : "Send Inquiry"} <span aria-hidden="true">↗</span>
        </button>
        {notice && <p className={styles.notice} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</p>}
      </div>
    </form>
  );
}
