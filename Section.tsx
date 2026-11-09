/**
 * Shared section shell: same horizontal alignment as the hero, a thin top
 * divider, a small index label and a large heading.
 */
export default function Section({
  id,
  index,
  label,
  heading,
  intro,
  children,
}: {
  id: string;
  index: string;
  label: string;
  heading: string;
  /** Optional one-line introduction under the heading. */
  intro?: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-[72px] lg:scroll-mt-[88px]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-[72px]">
        <div className="border-t border-line py-20 sm:py-24 lg:py-32">
          <p className="flex items-center gap-4 text-[13px] font-medium uppercase tracking-[0.08em] text-muted">
            <span className="text-fg">{index}</span>
            <span aria-hidden="true" className="h-px w-8 bg-line" />
            {label}
          </p>
          <h2
            id={headingId}
            className="mt-6 text-[clamp(2.5rem,5.5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em] text-fg"
          >
            {heading}
          </h2>
          {intro && (
            <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-muted sm:text-[19px]">{intro}</p>
          )}
          <div className="mt-14 lg:mt-20">{children}</div>
        </div>
      </div>
    </section>
  );
}
