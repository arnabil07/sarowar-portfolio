/**
 * Personal content lives here so it can be edited without touching components.
 * Replace any value marked TODO with your real details.
 */

export const site = {
  // Production domain. Set NEXT_PUBLIC_SITE_URL in your hosting environment to override.
  // TODO: confirm this is your real domain before deploying.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://sarowarhussain.com").replace(/\/+$/, ""),
  title: "Sarowar Hussain — SEO Consultant, Web Developer & Digital Product Builder",
  description:
    "Sarowar Hussain is an SEO consultant, web developer and digital product builder helping businesses grow through search, technology and thoughtful design.",
};

export const profile = {
  initials: "SH",
  greeting: "Hello, I'm",
  firstName: "Sarowar",
  lastName: "Hussain",
  roles: ["SEO Consultant", "Web Developer", "Digital Product Builder"],
  intro:
    "I build digital experiences that help businesses grow through search, technology and thoughtful design.",
  avatar: {
    src: "/images/sarowar-avatar.webp",
    width: 1080,
    height: 951,
    alt: "Portrait of Sarowar Hussain, a man with short dark hair and a trimmed beard, wearing a black hoodie",
  },
};

export const about = {
  heading: "About Me",
  // Written from the areas you listed. Edit freely — no achievements or figures have been added.
  paragraphs: [
    "I'm an SEO consultant and web developer who builds digital products with search in mind from the very first line of code.",
    "My work sits where search, technology and design meet: making websites that are fast, well-structured and easy to find, then shaping them into products people actually want to use.",
    "Increasingly, I bring AI-powered workflows into that process to research, build and iterate more efficiently, so businesses can grow without unnecessary complexity.",
  ],
  expertise: [
    "Search Engine Optimisation",
    "Technical SEO",
    "Website Development",
    "Digital Product Development",
    "AI Workflows",
  ],
};

export const heroActions = [
  { label: "View Projects", href: "#projects", variant: "primary" as const },
  { label: "About Me", href: "#about", variant: "secondary" as const },
];
