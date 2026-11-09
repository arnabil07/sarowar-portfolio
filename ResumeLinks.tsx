"use client";

import { Download, ExternalLink } from "lucide-react";
import { resume } from "@/data/resume";
import { analyticsEvents, track } from "@/lib/analytics";

type Variant = "nav" | "hero" | "menu";

/**
 * Download + View resume links. Both point at the same file in /public.
 * Rendered only when the PDF exists (the page passes `available` from a
 * server-side file check), so visitors never hit a 404.
 */
export default function ResumeLinks({
  available,
  variant,
  onNavigate,
}: {
  available: boolean;
  variant: Variant;
  onNavigate?: () => void;
}) {
  if (!available) return null;

  const icon = "size-4 shrink-0";

  const download = (
    <a
      href={resume.href}
      download={resume.fileName}
      type="application/pdf"
      aria-label="Download Sarowar Hussain's resume (PDF)"
      onClick={() => {
        track(analyticsEvents.resumeDownload, { location: variant });
        onNavigate?.();
      }}
      className={
        variant === "nav"
          ? "inline-flex items-center gap-2 rounded-full border border-fg/70 px-5 py-2 text-[14px] text-fg transition-colors hover:bg-fg hover:text-bg motion-reduce:transition-none"
          : variant === "menu"
            ? "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-fg px-5 text-[15px] font-medium text-bg"
            : "inline-flex min-h-11 items-center gap-2 text-fg underline decoration-fg/40 underline-offset-[6px] transition-colors hover:decoration-fg"
      }
    >
      <Download aria-hidden="true" className={icon} strokeWidth={1.75} />
      {variant === "nav" ? "Resume" : "Download Resume"}
    </a>
  );

  if (variant === "nav") return download;

  // Opens in a new tab; no download attribute, so the browser's PDF viewer is used.
  const view = (
    <a
      href={resume.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View Sarowar Hussain's resume (PDF, opens in a new tab)"
      onClick={() => {
        track(analyticsEvents.resumeView, { location: variant });
        onNavigate?.();
      }}
      className={
        variant === "menu"
          ? "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-fg/70 px-5 text-[15px] text-fg"
          : "inline-flex min-h-11 items-center gap-2 text-muted underline-offset-[6px] transition-colors hover:text-fg hover:underline"
      }
    >
      View Resume
      <ExternalLink aria-hidden="true" className={icon} strokeWidth={1.75} />
    </a>
  );

  return variant === "menu" ? (
    <div className="flex gap-3 pt-6">
      {download}
      {view}
    </div>
  ) : (
    <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 text-[15px]">
      {download}
      <span aria-hidden="true" className="h-3 w-px bg-line max-[359px]:hidden" />
      {view}
    </p>
  );
}
