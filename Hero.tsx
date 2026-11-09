import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { profile, heroActions } from "@/data/profile";
import ResumeLinks from "@/components/ResumeLinks";

export default function Hero({ resumeAvailable = false }: { resumeAvailable?: boolean }) {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden lg:min-h-[100dvh]"
    >
      {/* Very soft neutral light behind the portrait, matching the reference atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_72%_45%,#15181d_0%,#08090b_70%)]"
      />

      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 pt-32 sm:px-10 lg:min-h-[100dvh] lg:grid-cols-[1fr_1.05fr] lg:gap-0 lg:px-[72px] lg:pt-0">
        {/* Text */}
        <div className="flex flex-col justify-center lg:pb-10 lg:pt-28">
          <p className="flex items-center gap-4 text-[13px] font-medium uppercase tracking-[0.08em] text-fg sm:text-[15px]">
            {profile.greeting}
            <span aria-hidden="true" className="h-px w-12 bg-fg/80" />
          </p>

          <h1
            id="hero-heading"
            className="mt-6 text-[clamp(3.5rem,8vw,6.25rem)] font-normal leading-[1.02] tracking-[-0.035em] text-fg"
          >
            {profile.firstName}
            <br />
            {profile.lastName}
          </h1>

          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-medium text-fg sm:text-[17px]">
            {profile.roles.map((role, i) => (
              <span key={role} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="text-muted">·</span>}
                {role}
              </span>
            ))}
          </p>

          <p className="mt-8 max-w-[34ch] text-[16px] leading-[1.6] text-muted sm:text-[18px]">
            {profile.intro}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {heroActions.map((action) =>
              action.variant === "primary" ? (
                <a
                  key={action.label}
                  href={action.href}
                  className="inline-flex items-center gap-2.5 rounded-full bg-fg px-6 py-3.5 text-[15px] font-medium text-bg transition-colors hover:bg-white"
                >
                  {action.label}
                  <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
                </a>
              ) : (
                <a
                  key={action.label}
                  href={action.href}
                  className="inline-flex items-center rounded-full border border-fg/70 px-7 py-3.5 text-[15px] font-medium text-fg transition-colors hover:bg-fg hover:text-bg"
                >
                  {action.label}
                </a>
              ),
            )}
          </div>

          {/* Shown only when the resume PDF exists */}
          <ResumeLinks available={resumeAvailable} variant="hero" />
        </div>

        {/* Static avatar — no animation, anchored to the bottom of the hero */}
        <div className="relative -mx-6 flex items-end justify-center sm:-mx-10 lg:-ml-0 lg:-mr-[72px] lg:justify-end">
          <Image
            src={profile.avatar.src}
            alt={profile.avatar.alt}
            width={profile.avatar.width}
            height={profile.avatar.height}
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="h-auto w-full max-w-[560px] select-none lg:h-[min(80dvh,820px)] lg:w-auto lg:max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
