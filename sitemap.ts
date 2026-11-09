import type { MetadataRoute } from "next";
import { site } from "@/data/profile";

// Single-page site: sections are fragments of "/", so only the page itself is listed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
