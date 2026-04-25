import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const projectsCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1).max(140),
        description: z.string().min(1).max(360),
        keywords: z.string(),
        image: image(), // Native Astro image processing
        tags: z.array(z.string()).default([]),
        isShow: z.boolean().default(true),
        featured: z.boolean().default(false),
        order: z.number().default(0),
        // Flattened actions
        primaryAction: z
          .object({
            label: z.string(),
            url: z.string().startsWith("http"),
          })
          .optional(),
        secondaryActions: z
          .array(
            z.object({
              icon: z.string(),
              url: z.string().startsWith("http"),
              ariaLabel: z.string(),
            }),
          )
          .default([]),
      })
      .strict(),
});

export const collections = {
  projects: projectsCollection,
};
