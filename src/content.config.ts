import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const products = defineCollection({
  loader: glob({ base: "./src/content/products", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.string(),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    screenshots: z.array(z.string()).optional(),
    /** Dated changelog entries; order doesn't matter, pages sort newest first. */
    updates: z
      .array(z.object({ date: z.coerce.date(), notes: z.array(z.string()) }))
      .optional(),
  }),
});

export const collections = { products };
