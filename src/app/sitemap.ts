import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { POSTS_QUERY } from "@/sanity/queries";

const BASE_URL = "https://gpayment.ao";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/document`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const posts = await client.fetch(POSTS_QUERY);
    blogPages = posts.map(
      (post: { slug: string; publishedAt?: string }) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    );
  } catch {
    // Sanity may not be configured; skip blog pages
  }

  return [...staticPages, ...blogPages];
}
