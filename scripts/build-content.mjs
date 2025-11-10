import fs from 'fs';
import grayMatter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import { fileURLToPath } from 'url';
import calculateReadingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'data');

function sluggify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function parseMDXFile(rawString) {
  return await bundleMDX({
    source: rawString,
    cwd: path.join(__dirname, '..', 'cms'),
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

async function buildContent() {
  console.log('Building content...');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all MDX files
  const mdxFiles = fs.readdirSync(CONTENT_DIR).filter((file) => path.extname(file) === '.mdx');

  const posts = [];

  // Process each MDX file
  for (const file of mdxFiles) {
    const slug = file.replace(/\.mdx$/, '');
    const mdxPath = path.join(CONTENT_DIR, file);
    const rawString = fs.readFileSync(mdxPath, 'utf-8');

    try {
      const { code, frontmatter, matter } = await parseMDXFile(rawString);
      const readingTime = calculateReadingTime(matter.content);

      if (frontmatter.tags) {
        frontmatter.tagsAsSlugs = frontmatter.tags.map(sluggify);
      }

      const post = {
        ...frontmatter,
        slug,
        code,
        readingTime
      };

      posts.push(post);

      // Write individual post file
      const postOutputPath = path.join(OUTPUT_DIR, `${slug}.json`);
      fs.writeFileSync(postOutputPath, JSON.stringify(post, null, 2));

      console.log(`✓ Built ${slug}`);
    } catch (error) {
      console.error(`✗ Error building ${slug}:`, error.message);
    }
  }

  // Sort posts by date
  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Create metadata file (without code to keep it light)
  const metadata = posts.map((post) => {
    const { code, ...meta } = post;
    return meta;
  });

  const metadataPath = path.join(OUTPUT_DIR, 'posts.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`\n✓ Built ${posts.length} posts successfully!`);
  console.log(`✓ Metadata saved to ${metadataPath}`);
}

buildContent().catch(console.error);
