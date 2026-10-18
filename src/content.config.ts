import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    authors: z.array(z.string()).default(["add2333"]),
    affiliations: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    /** Keeps the legacy URL, e.g. "tools/beamer" -> /tools/beamer/ */
    permalink: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
