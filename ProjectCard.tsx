import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import TrackedLink from "@/components/TrackedLink";
import { analyticsEvents } from "@/lib/analytics";

/** Accept only well-formed http(s) URLs; anything else is treated as missing. */
function safeExternal(url?: string) {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Case studies may live on this site ("/work/…") or elsewhere. */
function safeCaseStudy(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("/") && !url.startsWith("//")) return { href: url, external: false };
  const ext = safeExternal(url);
  return ext ? { href: ext, external: true } : undefined;
}

/** One project row. `reverse` flips image/text order on large screens. */
export default function ProjectCard({
  project,
  index,
  reverse = false,
}: {
  project: Project;
  index: number;
  reverse?: boolean;
}) {
  const live = safeExternal(project.liveUrl);
  const github = safeExternal(project.githubUrl);
  const caseStudy = safeCaseStudy(project.caseStudyUrl);

  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
      <div className={`lg:col-span-7 ${reverse ? "lg:order-2 lg:col-start-6" : ""}`}>
        <div className="overflow-hidden rounded-2xl border border-line bg-[#111316]">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(min-width: 1440px) 760px, (min-width: 1024px) 55vw, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>

      <div className={`lg:col-span-4 ${reverse ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}>
        <p className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.08em] text-muted">
          <span className="tabular-nums text-fg">{String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden="true" className="h-px w-6 bg-line" />
          {project.category}
        </p>
        <h3 className="mt-5 text-[28px] leading-[1.15] tracking-[-0.02em] text-fg sm:text-[34px]">
          {project.name}
        </h3>
        {project.concept && (
          <p className="mt-4">
            <span className="inline-flex items-center rounded-full border border-line px-3 py-1 text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
              Concept Project
            </span>
          </p>
        )}
        <p className="mt-5 text-[16px] leading-[1.7] text-muted sm:text-[17px]">{project.description}</p>

        {project.stack && project.stack.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology stack">
            {project.stack.map((tech, i) => (
              <li key={i} className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-fg/90">
                {tech}
              </li>
            ))}
          </ul>
        )}

        {/* Only links with real URLs are rendered — no placeholder buttons */}
        {(live || github || caseStudy) && (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] font-medium">
            {live && (
              <TrackedLink
                href={live}
                external
                event={analyticsEvents.projectClick}
                props={{ project: project.name, link: "live" }}
                aria-label={`View project: ${project.name} (opens in a new tab)`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 text-bg transition-colors hover:bg-white motion-reduce:transition-none"
              >
                View Project
                <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </TrackedLink>
            )}
            {github && (
              <TrackedLink
                href={github}
                external
                event={analyticsEvents.projectClick}
                props={{ project: project.name, link: "github" }}
                aria-label={`${project.name} source code on GitHub (opens in a new tab)`}
                className="inline-flex min-h-11 items-center gap-1.5 text-fg underline-offset-4 hover:underline"
              >
                GitHub
                <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </TrackedLink>
            )}
            {caseStudy && (
              <TrackedLink
                href={caseStudy.href}
                external={caseStudy.external}
                event={analyticsEvents.projectClick}
                props={{ project: project.name, link: "case-study" }}
                aria-label={`Read the case study for ${project.name}${caseStudy.external ? " (opens in a new tab)" : ""}`}
                className="inline-flex min-h-11 items-center gap-1.5 text-muted underline-offset-4 hover:text-fg hover:underline"
              >
                Case Study
              </TrackedLink>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
