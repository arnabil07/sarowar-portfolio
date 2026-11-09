"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Catches rendering errors inside the page and offers a retry, in the site's style. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Logged for the developer; no details are shown to visitors.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col justify-center px-6 sm:px-10 lg:px-[72px]">
      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Something went wrong</p>
      <h1 className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-normal leading-[1.05] tracking-[-0.03em] text-fg">
        This page couldn&apos;t load properly.
      </h1>
      <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-muted">
        Please try again. If the problem continues, come back a little later.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center rounded-full bg-fg px-6 text-[15px] font-medium text-bg transition-colors hover:bg-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-full border border-fg/70 px-6 text-[15px] text-fg transition-colors hover:bg-fg hover:text-bg"
        >
          Go to the homepage
        </Link>
      </div>
    </main>
  );
}
