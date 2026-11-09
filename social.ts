/**
 * Contact and social links — fill these in with your real details.
 * Anything left empty is simply not shown on the site (no placeholders, no broken links).
 */

/** Public contact address shown on the site, e.g. "hello@yourdomain.com". */
// TODO: dummy address for testing — replace with your real public email before launch.
export const contactEmail = "sarowar.portfolio@example.com";

export type SocialLink = { label: "LinkedIn" | "GitHub"; href: string };

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: "" }, // TODO: e.g. "https://www.linkedin.com/in/your-handle"
  { label: "GitHub", href: "" }, // TODO: e.g. "https://github.com/your-handle"
];

const isHttpUrl = (href: string) => {
  try {
    const u = new URL(href);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

/** Only links with a real, well-formed URL. */
export const activeSocialLinks = socialLinks.filter((l) => isHttpUrl(l.href));

/** The email address if it looks valid, otherwise undefined. */
export const activeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ? contactEmail : undefined;
