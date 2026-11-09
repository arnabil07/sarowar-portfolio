import Section from "@/components/Section";
import { experience, experienceSection } from "@/data/experience";

export default function ExperienceSection() {
  return (
    <Section
      id="experience"
      index={experienceSection.index}
      label={experienceSection.label}
      heading={experienceSection.heading}
      intro={experienceSection.intro}
    >
      <ol className="relative border-l border-line lg:ml-[calc(25%-1px)]">
        {experience.map((item) => (
          <li key={`${item.company}-${item.start}`} className="relative pb-16 pl-8 last:pb-0 sm:pl-12">
            {/* Timeline marker — filled for the current role */}
            <span
              aria-hidden="true"
              className={`absolute -left-[5px] top-2 size-[9px] rounded-full border border-fg ${
                item.current ? "bg-fg" : "bg-bg"
              }`}
            />

            {/* Dates sit in the left gutter on desktop, above the title on smaller screens */}
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] tabular-nums text-muted lg:absolute lg:right-full lg:top-0.5 lg:mr-12 lg:flex-col lg:items-end lg:gap-y-2 lg:whitespace-nowrap lg:text-right">
              <span>
                <time dateTime={item.start}>{item.start}</time> –{" "}
                {item.end === "Present" ? item.end : <time dateTime={item.end}>{item.end}</time>}
              </span>
              {item.current && (
                <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-fg">Current role</span>
              )}
            </p>

            <h3 className="mt-2 text-[22px] leading-snug text-fg sm:text-[26px] lg:mt-0">{item.position}</h3>
            <p className="mt-1 text-[16px] text-muted">{item.company}</p>
            <p className="mt-5 max-w-[60ch] text-[16px] leading-[1.7] text-muted sm:text-[17px]">
              {item.description}
            </p>

            {item.achievements && item.achievements.length > 0 && (
              <ul className="mt-5 space-y-2">
                {item.achievements.map((a) => (
                  <li key={a} className="flex gap-3 text-[15px] leading-[1.6] text-fg/90">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-muted" />
                    {a}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
