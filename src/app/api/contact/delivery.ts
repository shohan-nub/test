import nodemailer from "nodemailer";
import { Resend } from "resend";

type Inquiry = {
  name: string;
  email: string;
  company?: string;
  service: string;
  budget?: string;
  timeline?: string;
  websiteUrl?: string;
  message: string;
};

const submittedAt = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Dhaka",
});

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character] ?? character);
}

function notification(inquiry: Inquiry) {
  const fields = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ...(inquiry.company ? [["Company", inquiry.company]] : []),
    ["Interested service", inquiry.service],
    ["Budget range", inquiry.budget ?? "Not provided"],
    ["Timeline", inquiry.timeline ?? "Not provided"],
    ...(inquiry.websiteUrl ? [["Website URL", inquiry.websiteUrl]] : []),
    ["Submitted", `${submittedAt.format(new Date())} (Asia/Dhaka)`],
  ];
  const rows = fields.map(([label, value]) =>
    `<p style="margin:0 0 12px"><strong style="display:block;color:#624738;font-size:12px">${label}</strong><span style="overflow-wrap:anywhere">${escapeHtml(value)}</span></p>`,
  ).join("");

  return {
    subject: `New SparkLab Project Inquiry — ${inquiry.name}`,
    text: `New SparkLab project inquiry\n\n${fields.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nProject description\n${inquiry.message}`,
    html: [
      '<div style="background:#faf4ee;padding:18px;color:#28221d;font:15px/1.55 Arial,sans-serif">',
      '<div style="max-width:580px;margin:auto;background:#fffdf9;border:1px solid #eadbd1;border-radius:16px;padding:20px">',
      '<p style="color:#a64825;font-size:12px;font-weight:bold;letter-spacing:.09em;margin:0 0 8px">SPARKLAB WEBSITE</p>',
      '<h1 style="font-size:25px;line-height:1.2;margin:0 0 20px">New project inquiry</h1>',
      rows,
      '<h2 style="border-top:1px solid #eadbd1;padding-top:14px;font-size:17px;margin:17px 0 8px">Project description</h2>',
      `<p style="margin:0;overflow-wrap:anywhere">${escapeHtml(inquiry.message).replace(/\r?\n/g, "<br>")}</p>`,
      '</div></div>',
    ].join(""),
  };
}

export async function deliverInquiry(inquiry: Inquiry): Promise<"sent" | "unconfigured" | "failed"> {
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!to) return "unconfigured";

  const smtpPass = process.env.SMTP_PASS?.replace(/\s/g, "");
  const fromName = process.env.CONTACT_FROM_NAME?.trim() || "SparkLab Website";
  const message = notification(inquiry);

  if (smtpPass) {
    const host = process.env.SMTP_HOST?.trim();
    const user = process.env.SMTP_USER?.trim();
    const port = Number(process.env.SMTP_PORT);
    const secure = process.env.SMTP_SECURE?.trim().toLowerCase();
    if (!host || !user || !Number.isInteger(port) || port < 1 || port > 65535 || (secure !== "true" && secure !== "false")) {
      return "unconfigured";
    }

    const smtp = nodemailer.createTransport({
      host,
      port,
      secure: secure === "true",
      requireTLS: secure === "false",
      auth: { user, pass: smtpPass },
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 12_000,
    });
    const result = await smtp.sendMail({
      ...message,
      from: { address: user, name: fromName },
      replyTo: { address: inquiry.email, name: inquiry.name },
      to,
    });
    return result.accepted.length > 0 && result.rejected.length === 0 ? "sent" : "failed";
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !from) return "unconfigured";

  const { data, error } = await new Resend(apiKey).emails.send({
    ...message,
    from,
    to,
    replyTo: inquiry.email,
  });
  return !error && data?.id ? "sent" : "failed";
}
