import Section from "@/components/Section";
import { about } from "@/data/profile";

export default function AboutSection() {
  return (
    <Section id="about" index="01" label="About" heading={about.heading}>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-6 lg:col-span-6">
          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-[20px] leading-[1.5] text-fg sm:text-[24px]"
                  : "text-[16px] leading-[1.7] text-muted sm:text-[18px]"
              }
            >
              {p}
            </p>
          ))}
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <h3 className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Expertise</h3>
          <ul className="mt-6 border-t border-line">
            {about.expertise.map((item, i) => (
              <li
                key={item}
                className="flex items-baseline justify-between gap-6 border-b border-line py-5 text-[18px] text-fg sm:text-[20px]"
              >
                {item}
                <span aria-hidden="true" className="text-[13px] tabular-nums text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
