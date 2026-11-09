/**
 * Server-only email delivery through Resend's REST API (no SDK dependency).
 * Requires RESEND_API_KEY, EMAIL_FROM (an address on a domain verified in Resend)
 * and CONTACT_EMAIL (your inbox). Read from the server environment only.
 */
import type { ContactValues } from "@/lib/contact-schema";

export type EmailConfig = { apiKey: string; from: string; to: string };

export function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  const to = process.env.CONTACT_EMAIL?.trim();
  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function buildEmail(v: ContactValues) {
  // Built only from validated single-line values, so no CR/LF can reach the header.
  const subject = `New Portfolio Enquiry: ${v.subject}`.slice(0, 200);

  const text = [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    `Subject: ${v.subject}`,
    `Message:`,
    v.message,
    ``,
    `— Sent from your portfolio contact form. Reply to this email to respond to ${v.name}.`,
  ].join("\n");

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`;

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#111">
<table style="border-collapse:collapse;margin:0 0 16px">
${row("Name:", v.name)}
${row("Email:", v.email)}
${row("Subject:", v.subject)}
</table>
<p style="margin:0 0 4px;color:#666">Message:</p>
<div style="white-space:pre-wrap;border-top:1px solid #ddd;padding-top:12px">${escapeHtml(v.message)}</div>
<p style="margin:24px 0 0;color:#999;font-size:13px">Sent from your portfolio contact form. Reply to this email to respond to the sender.</p>
</div>`;

  return { subject, text, html };
}

export type SendResult = { ok: true; id?: string } | { ok: false; status: number };

export async function sendContactEmail(
  config: EmailConfig,
  values: ContactValues,
  idempotencyKey?: string,
): Promise<SendResult> {
  const { subject, text, html } = buildEmail(values);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: values.email, // validated: a single address with no line breaks
        subject,
        text,
        html,
      }),
      signal: controller.signal,
    });
    if (!res.ok) return { ok: false, status: res.status };
    // Success only when Resend accepts the email and returns its id.
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    if (!data.id) return { ok: false, status: res.status };
    return { ok: true, id: data.id };
  } catch {
    return { ok: false, status: 0 };
  } finally {
    clearTimeout(timer);
  }
}
