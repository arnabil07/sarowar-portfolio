/**
 * Career timeline — the single source for the "My Journey" section.
 * Order: newest role first. Only add details you have confirmed.
 */

export const experienceSection = {
  index: "03",
  label: "Experience",
  heading: "My Journey.",
  intro: "My professional journey across digital marketing and search engine optimisation.",
};

export type ExperienceItem = {
  position: string;
  company: string;
  start: string; // e.g. "2025"
  end: string; // e.g. "Present"
  description: string;
  /** Marks the role you currently hold. */
  current?: boolean;
  achievements?: string[];
};

export const experience: ExperienceItem[] = [
  {
    position: "Digital Marketing Specialist",
    company: "Technovative Solutions",
    start: "2025",
    end: "Present",
    description:
      "Working in digital marketing, building on a professional background in search engine optimisation.",
    current: true,
  },
  {
    position: "SEO Specialist",
    company: "Alexander Cliffordd",
    start: "2024",
    end: "2025",
    description: "Professional experience specialising in search engine optimisation.",
  },
];
