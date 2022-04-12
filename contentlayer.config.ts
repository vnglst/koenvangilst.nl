import {
  ComputedFields,
  defineDocumentType,
  makeSource
} from 'contentlayer/source-files';

import readingTime from 'reading-time';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismPlus from 'rehype-prism-plus';

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  wordCount: {
    type: 'number',
    resolve: (doc) => doc.body.raw.split(/\s+/gu).length
  },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, '')
  }
};

const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    publishedAt: { type: 'string', required: true },
    summary: { type: 'string', required: true }
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
    year: { type: 'string', required: true }
  },
  computedFields
}));

const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'lab/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    url: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    year: { type: 'string', required: true },
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
