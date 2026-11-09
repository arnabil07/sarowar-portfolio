"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies an email address to the clipboard with visible + announced feedback. */
export default function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      // Fallback for browsers/contexts without the async Clipboard API.
      try {
        const ta = document.createElement("textarea");
        ta.value = email;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        ta.remove();
      } catch {
        ok = false;
      }
    }
    setState(ok ? "copied" : "error");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2500);
  };

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy email address ${email}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-[14px] text-fg transition-colors hover:border-fg/70 motion-reduce:transition-none"
      >
        {state === "copied" ? (
          <Check aria-hidden="true" className="size-4" strokeWidth={1.75} />
        ) : (
          <Copy aria-hidden="true" className="size-4" strokeWidth={1.75} />
        )}
        {state === "copied" ? "Copied" : "Copy"}
      </button>
      <span role="status" aria-live="polite" className="text-[13px] text-muted">
        {state === "copied" && <span className="sr-only">Email address copied to clipboard.</span>}
        {state === "error" && "Couldn't copy — please select the address manually."}
      </span>
    </span>
  );
}
