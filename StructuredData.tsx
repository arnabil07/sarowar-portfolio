import { site, profile, about } from "@/data/profile";
import { experience } from "@/data/experience";
import { activeEmail, activeSocialLinks } from "@/data/social";

/**
 * schema.org Person + WebSite. Built only from verified content in the data files:
 * current role from experience.ts, profiles only if real URLs exist. No ratings or credentials.
 */
export default function StructuredData() {
  const current = experience.find((e) => e.current);
  const person = {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: `${profile.firstName} ${profile.lastName}`,
    url: `${site.url}/`,
    image: `${site.url}${profile.avatar.src}`,
    description: site.description,
    ...(current && {
      jobTitle: current.position,
      worksFor: { "@type": "Organization", name: current.company },
    }),
    knowsAbout: about.expertise,
    ...(activeSocialLinks.length > 0 && { sameAs: activeSocialLinks.map((l) => l.href) }),
    ...(activeEmail && { email: `mailto:${activeEmail}` }),
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: `${site.url}/`,
        name: `${profile.firstName} ${profile.lastName}`,
        inLanguage: "en-GB",
        publisher: { "@id": `${site.url}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
