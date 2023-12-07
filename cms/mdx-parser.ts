import fs from 'fs';
import grayMatter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import calculateReadingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';

export async function loadMetadataFromDir<T>(dir: string) {
  const mdxFiles = fs
    .readdirSync(dir)
    .filter((file) => path.extname(file) === '.mdx');

  return (await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(/\.mdx$/, '');
      const rawString = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data } = grayMatter(rawString);
      return {
        ...data,
        slug
      };
    })
  )) as T[];
}

export async function loadMDXFile<T>(slug: string, dir: string) {
  const rawString = loadFile(path.join(dir, slug + '.mdx'));

  if (!rawString) {
    return;
  }

  const { code, frontmatter, matter } = await parseMDXFile(rawString);
  const readingTime = calculateReadingTime(matter.content);

  return {
    ...frontmatter,
    slug,
    code,
    readingTime
  } as T;
}

export function loadFile(path) {
  try {
    const rawString = fs.readFileSync(path, 'utf-8');
    return rawString;
  } catch (error) {
    console.log('Error loading file: ', error.message);
    return;
  }
}

async function parseMDXFile(rawString: string) {
  return await bundleMDX({
    source: rawString,
    cwd: path.join(process.cwd(), 'cms'),
    mdxOptions(options) {
      const { rehypePlugins = [] } = options;

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
