"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { findService, inquiryBudgets, services } from "../../services-data";
import styles from "../AgencyPages.module.css";

export default function InquiryForm() {
  const searchParams = useSearchParams();
  const selectedService = findService(searchParams.get("service"))?.id ?? "";
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string }>();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
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
        setNotice({
          type: "error",
          message: response.status === 503
            ? "Project inquiry email is not available yet. You can still book a discovery call."
            : typeof result.error === "string" ? result.error : "Your inquiry couldn’t be sent. Please try again.",
        });
        return;
      }

      form.reset();
      setNotice({ type: "success", message: "Your project inquiry was sent. Thanks for getting in touch." });
    } catch {
      setNotice({ type: "error", message: "Your inquiry couldn’t be sent. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className={styles.form} method="post" onSubmit={submit} aria-describedby="inquiry-required">
      <p id="inquiry-required" className={styles.formNote}>All fields are required except company name.</p>
      <div className={styles.formFields}>
        <label>Full Name <input name="name" autoComplete="name" required maxLength={100} /></label>
        <label>Email Address <input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label className={styles.fullField}>Company / Business Name <input name="company" autoComplete="organization" maxLength={150} /></label>
        <label>Service Interested In
          <select key={selectedService} name="service" defaultValue={selectedService} required>
            <option value="" disabled>Select a service</option>
            {services.map(service => <option key={service.id} value={service.id}>{service.title}</option>)}
          </select>
        </label>
        <label>Estimated Project Budget
          <select name="budget" defaultValue="" required>
            <option value="" disabled>Select a range</option>
            {inquiryBudgets.map(budget => <option key={budget.id} value={budget.id}>{budget.label}</option>)}
          </select>
        </label>
        <label className={styles.fullField}>Project Details <textarea name="message" rows={5} required maxLength={5000} /></label>
      </div>
      <div className={styles.trap} aria-hidden="true">
        <label>Leave this field blank <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.button} disabled={sending}>
          {sending ? "Sending…" : "Send Project Inquiry"} <span aria-hidden="true">↗</span>
        </button>
        {notice && <p className={styles.notice} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</p>}
      </div>
    </form>
  );
}
