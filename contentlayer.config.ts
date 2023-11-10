import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import {
  ComputedFields,
  defineDocumentType,
  defineNestedType,
  makeSource
} from 'contentlayer/source-files';

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  wordCount: {
    type: 'number',
    resolve: (doc) => doc.body.raw.split(/\s+/gu).length
  },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, '')
  },
  tagsAsSlugs: {
    type: 'list',
    resolve: (doc) =>
      doc.tags?._array.map((tag: string) =>
        tag.trim().toLowerCase().split(' ').join('-')
      )
  }
};

const Image = defineNestedType(() => ({
  name: 'Image',
  fields: {
    src: { type: 'string', required: true },
    alt: { type: 'string', required: true },
    width: { type: 'number', required: true },
    height: { type: 'number', required: true },
    showAsHeader: { type: 'boolean', default: true }
  }
}));

const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    publishedAt: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    tags: { type: 'list', required: true, of: { type: 'string' } },
    image: { type: 'nested', of: Image, required: false }
  },
  computedFields
}));

const Snippet = defineDocumentType(() => ({
  name: 'Snippet',
  filePathPattern: 'snippets/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    logo: { type: 'string', required: true }
  },
  computedFields
}));

const Client = defineDocumentType(() => ({
  name: 'Client',
  filePathPattern: 'portfolio/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    year: { type: 'number', required: true }
  },
  computedFields
}));

const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'labs/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    url: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    year: { type: 'number', required: true },
    image: { type: 'string', required: false }
  },
  computedFields
}));

const contentLayerConfig = makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Snippet, Client, Project],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
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
    ]
  }
});

export default contentLayerConfig;
