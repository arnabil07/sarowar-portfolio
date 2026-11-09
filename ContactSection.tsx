import { ArrowUpRight } from "lucide-react";
import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import CopyEmail from "@/components/CopyEmail";
import { activeEmail, activeSocialLinks } from "@/data/social";

export default function ContactSection() {
  return (
    <Section id="contact" index="04" label="Contact" heading="Let's Build Something Meaningful.">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="max-w-[44ch] text-[18px] leading-[1.6] text-muted sm:text-[20px]">
            Have a website, product or search challenge in mind? I&apos;m always open to a conversation
            about new projects and collaborations.
          </p>

          {/* Email — shown only once a real address is configured in src/data/social.ts */}
          {activeEmail && (
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
              <a
                href={`mailto:${activeEmail}`}
                aria-label={`Email Sarowar Hussain at ${activeEmail}`}
                className="inline-flex items-center gap-2 border-b border-fg/40 pb-1.5 text-[18px] text-fg transition-colors [overflow-wrap:anywhere] hover:border-fg min-[400px]:text-[20px] sm:text-[24px]"
              >
                {/* Wrap only before the "@" on narrow screens, never mid-word */}
                <span>
                  {activeEmail.split("@")[0]}
                  <wbr />@{activeEmail.split("@")[1]}
                </span>
                <ArrowUpRight aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.5} />
              </a>
              <CopyEmail email={activeEmail} />
            </div>
          )}

          {/* Social profiles — only those with real URLs */}
          {activeSocialLinks.length > 0 && (
            <ul className="mt-10 border-t border-line">
              {activeSocialLinks.map((link) => (
                <li key={link.label} className="border-b border-line">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Sarowar Hussain on ${link.label} (opens in a new tab)`}
                    className="flex min-h-14 items-center justify-between gap-6 text-[16px] text-fg transition-colors hover:text-fg/80"
                  >
                    {link.label}
                    <ArrowUpRight aria-hidden="true" className="size-4 text-muted" strokeWidth={1.75} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm fallbackEmail={activeEmail} />
        </div>
      </div>
    </Section>
  );
}
