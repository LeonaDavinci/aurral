import type { MetadataRoute } from "next";
import { SITE, ALL_ENTITIES, SCENARIOS, COMPARISONS, TOOLS } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/features`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/discover`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/flows`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/playlists`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/quality`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/integrations`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE.url}/tools`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/compare`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/scenarios`, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE.url}/glossary`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/getting-started`, changeFrequency: "monthly", priority: 0.9 },
  ];

  const entities: MetadataRoute.Sitemap = ALL_ENTITIES.map((e) => ({
    url: `${SITE.url}${e.href}`,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: now,
  }));

  const scenarios: MetadataRoute.Sitemap = SCENARIOS.map((s) => ({
    url: `${SITE.url}${s.href}`,
    changeFrequency: "monthly",
    priority: 0.75,
    lastModified: now,
  }));

  const compares: MetadataRoute.Sitemap = COMPARISONS.map((c) => ({
    url: `${SITE.url}${c.href}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: now,
  }));

  const tools: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: `${SITE.url}${t.href}`,
    changeFrequency: "monthly",
    priority: 0.75,
    lastModified: now,
  }));

  return [...core, ...entities, ...scenarios, ...compares, ...tools];
}