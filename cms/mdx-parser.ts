import fs from 'fs';
import grayMatter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { calculateReadingTime } from 'lib/reading-time';
import { sluggify } from 'lib/sluggify';

import { Post, PostMeta } from './schema';

const CONTENT_DIR = 'content';

export async function getPosts() {
  const mdxFiles = fs.readdirSync(CONTENT_DIR).filter((file) => path.extname(file) === '.mdx');

  const rawMetadata = mdxFiles.map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const mdxPath = path.join(process.cwd(), CONTENT_DIR, file);
    const rawString = fs.readFileSync(mdxPath, 'utf-8');
    const { data } = grayMatter(rawString);

    if (data.tags) {
      data.tagsAsSlugs = data.tags.map(sluggify);
    }

    return {
      ...data,
      slug
    };
  });

  const validatedItems = rawMetadata.map((item) => {
    try {
      return PostMeta.parse(item);
    } catch (error) {
      console.error('Error parsing item: ', item);
      console.error('Error: ', error.message);
      throw error;
    }
  });

  return validatedItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPost(slug: string) {
  const mdxFilePath = path.join(process.cwd(), CONTENT_DIR, slug + '.mdx');
  const rawString = loadFile(mdxFilePath);

  if (!rawString) {
    return null;
  }

  const { code, frontmatter, matter } = await parseMDXFile(rawString);
  const readingTime = calculateReadingTime(matter.content);

  if (frontmatter.tags) {
    frontmatter.tagsAsSlugs = frontmatter.tags.map(sluggify);
  }

  const rawFile = {
    ...frontmatter,
    slug,
    code,
    readingTime
  };

  try {
    return Post.parse(rawFile);
  } catch (error) {
    console.error('Error parsing file: ', CONTENT_DIR + '/' + slug);
    console.error('Error: ', error.message);
    throw error;
  }
}

function loadFile(path: string) {
  try {
    const rawString = fs.readFileSync(path, 'utf-8');
    return rawString;
  } catch (error) {
    console.error('Error loading file: ', error.message);
    return null;
  }
}

async function parseMDXFile(rawString: string) {
  return await bundleMDX({
    source: rawString,
    cwd: path.join(process.cwd(), 'cms'),
    mdxOptions(options) {
      const rehypePlugins = options.rehypePlugins || [];
      const remarkPlugins = options.remarkPlugins || [];

      options.remarkPlugins = [...remarkPlugins, remarkGfm];

      options.rehypePlugins = [
        ...rehypePlugins,
        rehypeSlug,
        rehypeCodeTitles,
        rehypePrismPlus,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ['anchor']
            }
          }
        ]
      ];

      return options;
    }
  });
}
