import * as z from 'zod';

export const SnippetMeta = z
  .object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    logo: z.string()
  })
  .strict();

export const Snippet = SnippetMeta.extend({
  code: z.string(),
  readingTime: z.object({
    text: z.string(),
    minutes: z.number(),
    time: z.number(),
    words: z.number()
  })
});

export const PostMeta = z
  .object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    publishedAt: z.string(),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
        width: z.number(),
        height: z.number(),
        showAsHeader: z.boolean().optional()
      })
      .optional(),
    tags: z.array(z.string()),
    tagsAsSlugs: z.array(z.string())
  })
  .strict();

export const Post = PostMeta.extend({
  code: z.string(),
  readingTime: z.object({
    text: z.string(),
    minutes: z.number(),
    time: z.number(),
    words: z.number()
  })
});

export const ClientMeta = z
  .object({
    slug: z.string(),
    name: z.string(),
    summary: z.string(),
    year: z.number()
  })
  .strict();

export const Client = ClientMeta.extend({
  code: z.string(),
  readingTime: z.object({
    text: z.string(),
    minutes: z.number(),
    time: z.number(),
    words: z.number()
  })
});

export const ProjectMeta = z
  .object({
    slug: z.string(),
    name: z.string(),
    url: z.string(),
    summary: z.string(),
    year: z.number(),
    image: z.string().optional()
  })
  .strict();

export const Project = ProjectMeta.extend({
  code: z.string(),
  readingTime: z.object({
    text: z.string(),
    minutes: z.number(),
    time: z.number(),
    words: z.number()
  })
});

export type SnippetMeta = z.infer<typeof SnippetMeta>;
export type Snippet = z.infer<typeof Snippet>;
export type PostMeta = z.infer<typeof PostMeta>;
export type Post = z.infer<typeof Post>;
export type ClientMeta = z.infer<typeof ClientMeta>;
export type Client = z.infer<typeof Client>;
export type ProjectMeta = z.infer<typeof ProjectMeta>;
export type Project = z.infer<typeof Project>;
