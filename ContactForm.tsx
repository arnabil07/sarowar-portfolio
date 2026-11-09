"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  contactFields,
  limits,
  normalise,
  validate,
  validateField,
  type ContactErrors,
  type ContactValues,
} from "@/lib/contact-schema";
import { analyticsEvents, track } from "@/lib/analytics";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const empty: ContactValues = { name: "", email: "", subject: "", message: "" };

/** RFC 4122 v4 UUID; randomUUID needs a secure context, so fall back to getRandomValues. */
function newId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// Friendly messages only — no server or provider details reach the browser.
const serverMessages: Record<string, string> = {
  rate_limited: "You've sent several messages in a short time. Please wait a few minutes and try again.",
  not_configured: "The contact form isn't available right now. Please try again later.",
  delivery_failed: "Your message couldn't be sent just now. Please try again in a moment.",
  validation: "Please check the highlighted fields.",
};

export default function ContactForm({ fallbackEmail }: { fallbackEmail?: string }) {
  const [values, setValues] = useState<ContactValues>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactValues, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const startedAt = useRef<number>(0);
  const submissionId = useRef<string>("");
  const inFlight = useRef(false);
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    subject: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };
  const successRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    submissionId.current = newId();
  }, []);

  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
    if (status.kind === "error") statusRef.current?.focus();
  }, [status]);

  const update = (field: keyof ContactValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Once a field has been visited, re-validate it as the visitor types.
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validateField(field, normalise(next)) }));
    if (status.kind === "error") setStatus({ kind: "idle" });
  };

  const blur = (field: keyof ContactValues) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, normalise(values)) }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return; // blocks double-clicks and repeated Enter

    const clean = normalise(values);
    const found = validate(clean);
    setTouched({ name: true, email: true, subject: true, message: true });
    setErrors(found);
    const firstInvalid = contactFields.find((f) => found[f]);
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }

    const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";

    inFlight.current = true;
    setStatus({ kind: "submitting" });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...clean,
          website: honeypot,
          startedAt: startedAt.current,
          submissionId: submissionId.current,
        }),
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: ContactErrors };

      if (res.ok && data.ok) {
        track(analyticsEvents.contactSuccess); // no form content or personal data
        setStatus({ kind: "success" });
        setValues(empty);
        setTouched({});
        setErrors({});
        submissionId.current = newId();
        return;
      }

      if (data.error === "validation" && data.fields) {
        setErrors(data.fields);
        const first = contactFields.find((f) => data.fields?.[f]);
        if (first) refs[first].current?.focus();
      }
      setStatus({ kind: "error", message: serverMessages[data.error ?? ""] ?? serverMessages.delivery_failed });
    } catch {
      setStatus({
        kind: "error",
        message: "We couldn't reach the server. Please check your connection and try again.",
      });
    } finally {
      clearTimeout(timer);
      inFlight.current = false;
    }
  };

  if (status.kind === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-line p-8 outline-none sm:p-10"
      >
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Message sent</p>
        <p className="mt-4 text-[22px] leading-snug text-fg sm:text-[26px]">Thank you — your message is on its way.</p>
        <p className="mt-4 text-[16px] leading-[1.7] text-muted">
          I&apos;ll reply to the email address you provided as soon as I can.
        </p>
        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus({ kind: "idle" });
            requestAnimationFrame(() => refs.name.current?.focus());
          }}
          className="mt-8 inline-flex min-h-11 items-center rounded-full border border-fg/70 px-6 text-[15px] text-fg transition-colors hover:bg-fg hover:text-bg motion-reduce:transition-none"
        >
          Send another message
        </button>
      </div>
    );
  }

  const submitting = status.kind === "submitting";
  // Dark field, subtle grey border, white text; focus brightens the border and adds a soft ring.
  const fieldClass = (invalid: boolean) =>
    `mt-2.5 block w-full min-h-12 rounded-xl border bg-[#0E1013] px-4 py-3 text-[16px] text-fg placeholder:text-muted/50 outline-none transition-[border-color,box-shadow] focus-visible:outline-none focus:ring-2 motion-reduce:transition-none ${
      invalid
        ? "border-[#e8a0a0]/70 focus:border-[#e8a0a0] focus:ring-[#e8a0a0]/20"
        : "border-line hover:border-[#34383d] focus:border-fg/80 focus:ring-fg/15"
    }`;
  const labelClass = "block text-[13px] font-medium uppercase tracking-[0.08em] text-muted";
  const errorEl = (field: keyof ContactValues) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-2 text-[14px] text-[#e8a0a0]">
        {errors[field]}
      </p>
    ) : null;
  const describedBy = (field: keyof ContactValues, extra?: string) =>
    [errors[field] ? `${field}-error` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;
  const common = (field: keyof ContactValues) => ({
    id: field,
    name: field,
    required: true,
    value: values[field],
    onBlur: () => blur(field),
    "aria-invalid": !!errors[field],
    className: fieldClass(!!errors[field]),
  });

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="contact-form-title" aria-busy={submitting} className="space-y-7">
      <h3 id="contact-form-title" className="sr-only">
        Contact form
      </h3>
      <p className="text-[14px] text-muted">All fields are required.</p>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            ref={refs.name}
            {...common("name")}
            type="text"
            autoComplete="name"
            maxLength={limits.name.max}
            onChange={(e) => update("name", e.target.value)}
            aria-describedby={describedBy("name")}
          />
          {errorEl("name")}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            ref={refs.email}
            {...common("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={limits.email.max}
            onChange={(e) => update("email", e.target.value)}
            aria-describedby={describedBy("email")}
          />
          {errorEl("email")}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <input
          ref={refs.subject}
          {...common("subject")}
          type="text"
          autoComplete="off"
          maxLength={limits.subject.max}
          onChange={(e) => update("subject", e.target.value)}
          aria-describedby={describedBy("subject")}
        />
        {errorEl("subject")}
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <span id="message-count" className="text-[12px] tabular-nums text-muted" aria-live="off">
            {values.message.length.toLocaleString("en-GB")} / {limits.message.max.toLocaleString("en-GB")}
          </span>
        </div>
        <textarea
          ref={refs.message}
          {...common("message")}
          rows={6}
          maxLength={limits.message.max}
          onChange={(e) => update("message", e.target.value)}
          aria-describedby={describedBy("message", "message-count")}
          className={`${fieldClass(!!errors.message)} resize-y leading-[1.6]`}
        />
        {errorEl("message")}
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-fg px-7 text-[15px] font-medium text-bg transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none"
        >
          {submitting ? (
            <>
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-bg/30 border-t-bg motion-reduce:animate-none"
              />
              Sending…
            </>
          ) : (
            <>
              Send Message
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </>
          )}
        </button>

        <p
          ref={statusRef}
          tabIndex={-1}
          role={status.kind === "error" ? "alert" : "status"}
          className="text-[14px] leading-[1.6] outline-none"
        >
          {status.kind === "error" && (
            <span className="text-[#e8a0a0]">
              {status.message}
              {fallbackEmail && (
                <>
                  {" "}
                  You can also email{" "}
                  <a href={`mailto:${fallbackEmail}`} className="text-fg underline underline-offset-4">
                    {fallbackEmail}
                  </a>
                  .
                </>
              )}
            </span>
          )}
          {submitting && <span className="sr-only">Sending your message…</span>}
        </p>
      </div>
    </form>
  );
}
