/**
 * Contact form rules — shared by the browser (instant feedback) and the
 * server (authoritative check). No external validation library needed.
 */

export type ContactValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const contactFields = ["name", "email", "subject", "message"] as const;

export const limits = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 150 },
  message: { min: 10, max: 5000 },
} as const;

// Any line break or control character. Name, email and subject end up in email
// headers, so these are rejected outright (prevents header injection).
const LINE_BREAKS_OR_CONTROL = /[\r\n\u0000-\u001f\u007f\u2028\u2029]/;
// Control characters removed from the message (newline and tab are kept).
const MESSAGE_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
// One address only: no spaces, commas, angle brackets or quotes.
const EMAIL = /^[^\s@<>()[\]\\,;:"']+@[^\s@<>()[\]\\,;:"']+\.[^\s@<>()[\]\\,;:"']{2,}$/;

/** Trim and normalise raw input. Safe to call on untrusted data. */
export function normalise(input: Partial<Record<keyof ContactValues, unknown>>): ContactValues {
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  // Collapse spaces/tabs only — line breaks are kept so validation rejects them.
  const line = (v: unknown) => str(v).trim().replace(/[ \t]+/g, " ");
  return {
    name: line(input.name),
    email: str(input.email).trim().toLowerCase(),
    subject: line(input.subject),
    message: str(input.message).replace(/\r\n?/g, "\n").replace(MESSAGE_CONTROL, "").trim(),
  };
}

export function validateField(field: keyof ContactValues, v: ContactValues): string | undefined {
  switch (field) {
    case "name":
      if (!v.name) return "Please enter your full name.";
      if (LINE_BREAKS_OR_CONTROL.test(v.name)) return "Your name contains characters that aren't allowed.";
      if (v.name.length < limits.name.min) return "Your name looks too short.";
      if (v.name.length > limits.name.max) return `Please keep your name under ${limits.name.max} characters.`;
      return;
    case "email":
      if (!v.email) return "Please enter your email address.";
      if (v.email.length > limits.email.max || LINE_BREAKS_OR_CONTROL.test(v.email) || !EMAIL.test(v.email))
        return "Please enter a valid email address, e.g. name@example.com.";
      return;
    case "subject":
      if (!v.subject) return "Please add a subject.";
      if (LINE_BREAKS_OR_CONTROL.test(v.subject)) return "The subject must be a single line.";
      if (v.subject.length < limits.subject.min) return "Please make the subject a little more descriptive.";
      if (v.subject.length > limits.subject.max)
        return `Please keep the subject under ${limits.subject.max} characters.`;
      return;
    case "message":
      if (!v.message) return "Please write a message.";
      if (v.message.length < limits.message.min)
        return `Please add a little more detail (at least ${limits.message.min} characters).`;
      if (v.message.length > limits.message.max)
        return `Please keep your message under ${limits.message.max.toLocaleString("en-GB")} characters.`;
      return;
  }
}

export function validate(v: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  contactFields.forEach((f) => {
    const e = validateField(f, v);
    if (e) errors[f] = e;
  });
  return errors;
}

/** Shape of the JSON the form posts. */
export type ContactPayload = ContactValues & {
  /** Honeypot — real visitors never fill this in. */
  website?: string;
  /** Milliseconds since epoch when the form was first shown. */
  startedAt?: number;
  /** UUID per submission — makes retries idempotent. */
  submissionId?: string;
};

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
