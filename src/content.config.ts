import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    lede: z.string().optional(),
    date: z.coerce.date(),
    tag: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    blurb: z.string(),
    description: z.string(),
    short: z.string(),
    lang: z.string(),
    status: z.string(),
    version: z.string(),
    license: z.string().optional(),
    order: z.number(),
    tagline: z.string(),
    links: z
      .object({
        github: z.string().optional(),
        docs: z.string().optional(),
        changelog: z.string().optional(),
      })
      .optional(),
    facts: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        mono: z.boolean().optional(),
      })
    ),
    thumbLabel: z.string(),
    shotLabel: z.string(),
  }),
});

export const collections = { writing, projects };
