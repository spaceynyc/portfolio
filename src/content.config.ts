import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    number: z.string(),
    order: z.number(),
    year: z.number(),
    kind: z.enum(['immersive', 'agents', 'interface', 'automation']),
    blurb: z.string(),
    tech: z.array(z.string()),
    color: z.string(),
    featured: z.boolean().default(false),
    link: z.string().url().optional(),
    github: z.string().url().optional(),
    image: z.string().optional(),
    embed: z.boolean().default(false),
  }),
});

export const collections = { work };
