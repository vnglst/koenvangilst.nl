import * as z from 'zod';

export const PostMeta = z
  .object({
    slug: z.string(),
    url: z.string().optional(),
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

export type PostType = z.infer<typeof Post>;
