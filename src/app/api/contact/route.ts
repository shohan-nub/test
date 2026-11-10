import { NextResponse } from "next/server";
import { Resend } from "resend";

const MAX_REQUESTS = 5;
const WINDOW_MS = 60_000;
const requests = new Map<string, { count: number; startedAt: number }>();

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function isRateLimited(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const key = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = requests.get(key);
  if (!current || now - current.startedAt > WINDOW_MS) {
    requests.set(key, { count: 1, startedAt: now });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });

  try {
    const body = await request.json() as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const website = typeof body.website === "string" ? body.website.trim() : "";

    if (website) return NextResponse.json({ success: true });
    if (!name || !email || !subject || !message) return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    if (name.length > 100 || email.length > 254 || subject.length > 160 || message.length > 5000) return NextResponse.json({ error: "One or more fields exceed the allowed length." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !to || !from) return NextResponse.json({ error: "Contact email is not configured yet." }, { status: 503 });

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New Website Inquiry — ${subject}`,
      html: `<h2>New Spark Lab website inquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
      text: `New Spark Lab website inquiry\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });
    if (error) return NextResponse.json({ error: "Unable to send your message right now." }, { status: 502 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
  }
}
