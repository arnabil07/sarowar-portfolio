import { ArrowUp } from "lucide-react";
import { profile } from "@/data/profile";
import { activeSocialLinks } from "@/data/social";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-[72px]">
      <div className="flex flex-col gap-6 border-t border-line py-8 text-[14px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.firstName} {profile.lastName}
        </p>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {activeSocialLinks.length > 0 && (
            <ul className="flex gap-6">
              {activeSocialLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${l.label} (opens in a new tab)`}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-fg"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {/* Smooth scrolling comes from CSS and is disabled for reduced-motion users */}
          <a
            href="#home"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-fg/70 px-5 text-fg transition-colors hover:bg-fg hover:text-bg motion-reduce:transition-none"
          >
            Back to top
            <ArrowUp aria-hidden="true" className="size-4" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </footer>
  );
}
