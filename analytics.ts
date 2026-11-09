/**
 * Privacy-friendly event tracking (Plausible, cookieless).
 * No-ops unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set and the script has loaded.
 * Never pass personal data (names, emails, message text) as event props.
 */

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export const analyticsEvents = {
  resumeDownload: "Resume Download",
  resumeView: "Resume View",
  projectClick: "Project Link Click",
  contactSuccess: "Contact Form Submitted",
} as const;

export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // Analytics must never break the page.
  }
}
