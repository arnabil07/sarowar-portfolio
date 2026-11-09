import { NextResponse } from "next/server";
import { normalise, validate, UUID, type ContactPayload } from "@/lib/contact-schema";
import { getEmailConfig, sendContactEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 2_500; // faster than a human can fill the form

const json = (body: Record<string, unknown>, status: number, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** Visitor IP as reported by the hosting proxy (Vercel sets x-real-ip / x-forwarded-for). */
function clientIp(req: Request) {
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  return ip.trim().slice(0, 64);
}

export async function POST(req: Request) {
  // Same-origin only (blocks cross-site form posts).
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      /* "null" or malformed origin */
    }
    if (originHost !== host) return json({ error: "forbidden" }, 403);
  }

  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    return json({ error: "unsupported_media_type" }, 415);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);

  let body: ContactPayload;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  // Spam: honeypot filled, or submitted faster than a person could → accept silently, send nothing.
  const age = typeof body.startedAt === "number" ? Date.now() - body.startedAt : NaN;
  if (body.website || !Number.isFinite(age) || age < MIN_FILL_MS) {
    return json({ ok: true }, 200);
  }

  // 5 submissions per IP per 10 minutes (shared Redis store in production — see lib/rate-limit.ts).
  const limit = await rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return json({ error: "rate_limited" }, 429, { "Retry-After": String(limit.retryAfter) });
  }

  const values = normalise(body);
  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    return json({ error: "validation", fields: errors }, 422);
  }

  const config = getEmailConfig();
  if (!config) {
    console.error("[contact] Email is not configured: set RESEND_API_KEY, EMAIL_FROM and CONTACT_EMAIL.");
    return json({ error: "not_configured" }, 503);
  }

  const submissionId = typeof body.submissionId === "string" && UUID.test(body.submissionId) ? body.submissionId : undefined;
  const result = await sendContactEmail(config, values, submissionId && `contact-${submissionId}`);

  if (!result.ok) {
    // Log status only — never the visitor's details or the provider's response body.
    console.error(`[contact] Email provider error (status ${result.status}).`);
    return json({ error: "delivery_failed" }, 502);
  }

  return json({ ok: true }, 200);
}

export function GET() {
  return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
}
