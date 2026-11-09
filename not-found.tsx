import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found — Sarowar Hussain",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col justify-center px-6 sm:px-10 lg:px-[72px]">
      <p className="flex items-center gap-4 text-[13px] font-medium uppercase tracking-[0.08em] text-muted">
        <span className="text-fg">404</span>
        <span aria-hidden="true" className="h-px w-8 bg-line" />
        Page not found
      </p>
      <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em] text-fg">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-muted sm:text-[19px]">
        The link may be broken or the page may have moved.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 w-fit items-center gap-2.5 rounded-full bg-fg px-6 text-[15px] font-medium text-bg transition-colors hover:bg-white"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.75} />
        Back to the homepage
      </Link>
    </main>
  );
}
