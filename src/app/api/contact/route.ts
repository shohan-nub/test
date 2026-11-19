import { NextResponse } from "next/server";
import { findService, inquiryBudgets } from "../../services-data";
import { deliverInquiry } from "./delivery";

const MAX_REQUESTS = 5;
const WINDOW_MS = 60_000;
const MAX_BODY_BYTES = 32_768;
const requests = new Map<string, { count: number; expiresAt: number }>();
let pruneAfter = 0;

function isRateLimited(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();

  if (now >= pruneAfter) {
    for (const [address, entry] of requests) {
      if (entry.expiresAt <= now) requests.delete(address);
    }
    pruneAfter = now + WINDOW_MS;
  }

  const current = requests.get(key);
  if (!current || current.expiresAt <= now) {
    requests.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

function field(body: Record<string, unknown>, key: string) {
  return typeof body[key] === "string" ? body[key].trim() : "";
}

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function isWebsiteUrl(value: string) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (isRateLimited(request)) return error("Too many requests. Please try again shortly.", 429);
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return error("This inquiry is too large.", 413);

  const payload: unknown = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return error("Please send a valid inquiry.");
  }

  const body = payload as Record<string, unknown>;
  if (field(body, "website")) return error("Please leave the hidden website field blank.");

  const name = field(body, "name").replace(/\s+/g, " ");
  const email = field(body, "email");
  const company = field(body, "company");
  const message = field(body, "message");
  const timeline = field(body, "timeline");
  const websiteUrl = field(body, "websiteUrl");
  const selectedService = findService(body.service);
  const selectedBudget = inquiryBudgets.find(option => option.id === body.budget);
  const isProjectInquiry = body.kind === "project-inquiry";
  const service = isProjectInquiry ? selectedService?.title : field(body, "subject");

  if (isProjectInquiry && (!selectedService || !selectedBudget)) {
    return error("Please choose a service and project budget.");
  }
  if (!name || !email || !service || !message) return error("Please complete all required fields.");
  if (name.length > 100 || email.length > 254 || service.length > 160 || company.length > 150
      || message.length > 5000 || timeline.length > 150 || websiteUrl.length > 2048) {
    return error("One or more fields exceed the allowed length.");
  }
  if (!/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(email)) {
    return error("Please enter a valid email address.");
  }
  if (websiteUrl && !isWebsiteUrl(websiteUrl)) return error("Please enter a valid website URL.");

  try {
    const delivery = await deliverInquiry({
      name,
      email,
      company,
      service,
      budget: selectedBudget?.label,
      timeline: timeline || undefined,
      websiteUrl,
      message,
    });
    if (delivery === "unconfigured") return error("Project inquiry email is not configured.", 503);
    if (delivery === "sent") return NextResponse.json({ success: true });
  } catch (cause) {
    // Provider errors can contain submitted details. Keep those out of logs and responses.
    const code = typeof cause === "object" && cause && "code" in cause ? cause.code : undefined;
    if (code === "EAUTH") {
      console.error("Contact email authentication failed.");
      return error("Project inquiry email is unavailable while delivery settings are verified.", 503);
    }
    console.error("Contact email transport failed.");
  }
  return error("Unable to send your inquiry right now. Please try again.", 502);
}
