import type { MetadataRoute } from "next";
import { getMembers, getPosts } from "@/lib/content";

const site = process.env.SITE_URL ?? "https://wearnifa.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [members, posts] = await Promise.all([getMembers(), getPosts()]);
  const newest = posts[0]?.date ? new Date(posts[0].date) : new Date();

  return [
    { url: `${site}/`, lastModified: newest, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/posts`, lastModified: newest, changeFrequency: "weekly", priority: 0.8 },
    ...members.flatMap((m) => [
      { url: `${site}/${m.slug}`, lastModified: newest, changeFrequency: "monthly" as const, priority: 0.9 },
      { url: `${site}/${m.slug}/cv`, lastModified: newest, changeFrequency: "monthly" as const, priority: 0.6 },
    ]),
    ...posts.map((p) => ({
      url: `${site}/posts/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : newest,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
