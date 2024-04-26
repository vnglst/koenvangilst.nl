import fs from 'fs';
import grayMatter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import calculateReadingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';

import { sluggify } from 'lib/sluggify';

import {
  Client,
  ClientMeta,
  Post,
  PostMeta,
  Project,
  ProjectMeta,
  Snippet,
  SnippetMeta
} from './schema';

type MetadataValidators =
  | typeof SnippetMeta
  | typeof PostMeta
  | typeof ClientMeta
  | typeof ProjectMeta;

export async function loadAllMdx<Validated>(
  dir: string,
  Validator: MetadataValidators
) {
  const mdxFiles = fs
    .readdirSync(dir)
    .filter((file) => path.extname(file) === '.mdx');

  const rawMetadata = mdxFiles.map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const mdxPath = path.join(process.cwd(), dir, file);
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

  return rawMetadata.map((item) => {
    try {
      return Validator.parse(item) as Validated;
    } catch (error) {
      console.error('Error parsing item: ', item);
      console.error('Error: ', error.message);
      throw error;
    }
  });
}

type Validator = typeof Snippet | typeof Post | typeof Client | typeof Project;

export async function loadSingleMdx<Validated>(
  slug: string,
  dir: string,
  Validator: Validator
) {
  const mdxFilePath = path.join(process.cwd(), dir, slug + '.mdx');
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
    return Validator.parse(rawFile) as Validated;
  } catch (error) {
    console.error('Error parsing file: ', dir + '/' + slug);
    console.error('Error: ', error.message);
    throw error;
  }
}

function loadFile(path: string) {
  try {
    const rawString = fs.readFileSync(path, 'utf-8');
    return rawString;
  } catch (error) {
    console.log('Error loading file: ', error.message);
    return null;
  }
}

async function parseMDXFile(rawString: string) {
  return await bundleMDX({
    source: rawString,
    cwd: path.join(process.cwd(), 'cms'),
    mdxOptions(options) {
      const rehypePlugins = options.remarkPlugins || [];

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
