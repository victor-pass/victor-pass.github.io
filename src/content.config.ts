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
    /** Stills for the product card, link previews, and the start of the page carousel. */
    screenshots: z.array(z.string()).optional(),
    /** Demo videos shown in the page carousel after the screenshots; `small` plays inline, `src` when zoomed. */
    videos: z
      .array(
        z.object({
          src: z.string(),
          small: z.string().optional(),
          title: z.string(),
          caption: z.string(),
        }),
      )
      .optional(),
    /** Dated changelog entries; order doesn't matter, pages sort newest first. */
    updates: z
      .array(z.object({ date: z.coerce.date(), notes: z.array(z.string()) }))
      .optional(),
  }),
});

export const collections = { products };
