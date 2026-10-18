import type { CollectionEntry } from "astro:content";
import type { Lang } from "./i18n";

export const SITE = {
  title: "hahaha",
  author: "add2333",
  description: "Notes on LaTeX, machine learning and everything I keep forgetting.",
  url: "https://add2333.github.io",
  locale: "en",
};

export type Post = CollectionEntry<"blog">;

export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{Letter}\p{Number}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "untagged";
}

/** Route path without leading/trailing slashes, e.g. "tools/beamer". */
export function postPath(post: Post): string {
  return (post.data.permalink ?? post.id).replace(/^\/+|\/+$/g, "");
}

export function postUrl(post: Post): string {
  return `/${postPath(post)}/`;
}

export function byDateDesc(a: Post, b: Post): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function formatDate(date: Date, lang: Lang = "en"): string {
  return date.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function readingTime(body = ""): number {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  const cjk = (text.match(/[\u3400-\u9fff\uf900-\ufaff]/g) ?? []).length;
  return Math.max(1, Math.round((words + cjk / 2) / 220));
}

export function taxonomyCounts(posts: Post[], field: "tags" | "categories") {
  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const post of posts) {
    for (const name of post.data[field]) {
      const slug = slugify(name);
      const entry = map.get(slug) ?? { name, slug, count: 0 };
      entry.count += 1;
      map.set(slug, entry);
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function sortedPosts(): Promise<Post[]> {
  const { getCollection } = await import("astro:content");
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort(byDateDesc);
}
