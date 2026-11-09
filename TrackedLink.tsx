"use client";

import { track } from "@/lib/analytics";

/** An ordinary anchor that also sends a privacy-safe analytics event on click. */
export default function TrackedLink({
  event,
  props,
  external = false,
  ...anchor
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  props?: Record<string, string>;
  external?: boolean;
}) {
  return (
    <a
      {...anchor}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => {
        track(event, props);
        anchor.onClick?.(e);
      }}
    />
  );
}
