/**
 * Selected work — the single source for the Projects section.
 *
 * The three entries below are CONCEPT projects (design demonstrations with
 * original mockup images). They have no live URLs, so no link buttons are shown.
 * When you add real projects: set `concept: false` (or remove it), add the real
 * image to /public/images/projects/ (16:10, e.g. 1600×1000 WebP) and fill in any
 * URLs you have. Leave a URL empty and its button stays hidden.
 */

export type Project = {
  name: string;
  category: string;
  description: string;
  /** Technologies used — omit or leave empty to hide the tags. */
  stack?: string[];
  image: { src: string; alt: string; width: number; height: number };
  /** Live website — shown as the "View Project" button. */
  liveUrl?: string;
  /** Public source repository. */
  githubUrl?: string;
  /** Case study — an external URL or an on-site path such as "/work/project-name". */
  caseStudyUrl?: string;
  /** Shows a subtle "Concept Project" label for demonstration work. */
  concept?: boolean;
};

export const projects: Project[] = [
  {
    name: "SEO Growth Platform",
    category: "SEO & Analytics",
    description:
      "A concept SEO analytics dashboard designed to visualise keyword rankings, organic traffic and search performance.",
    image: {
      src: "/images/projects/seo-growth-platform.webp",
      alt: "Concept SEO analytics dashboard in a dark interface showing organic clicks, impressions, average position, a weekly organic traffic chart and a table of top keywords, labelled as sample data",
      width: 1600,
      height: 1000,
    },
    concept: true,
  },
  {
    name: "Modern Website Experience",
    category: "Web Design & Development",
    description:
      "A concept responsive website exploring clean layouts, intuitive navigation and modern user experience.",
    image: {
      src: "/images/projects/modern-website.webp",
      alt: "Concept website for a fictional design studio shown in a desktop browser window and on a mobile phone, with a light, minimal layout, large headline and simple navigation",
      width: 1600,
      height: 1000,
    },
    concept: true,
  },
  {
    name: "AI Workflow Dashboard",
    category: "AI & Automation",
    description:
      "A concept interface for organising workflows, automating repetitive tasks and tracking progress.",
    image: {
      src: "/images/projects/ai-workflow-dashboard.webp",
      alt: "Concept AI workflow dashboard in a dark interface showing a content publishing workflow of connected steps, from trigger and AI drafting to human review, alongside task progress bars, labelled as sample data",
      width: 1600,
      height: 1000,
    },
    concept: true,
  },
];
