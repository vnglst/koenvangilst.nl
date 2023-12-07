import { ReadTimeResults } from 'reading-time';

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    showAsHeader?: boolean;
  };
  tags: string[];
  tagsAsSlugs: string[];
};

export type Post = PostMeta & {
  code: string;
  readingTime: ReadTimeResults;
};

export type SnippetMeta = {
  slug: string;
  title: string;
  description: string;
  logo: string;
};

export type Snippet = SnippetMeta & {
  code: string;
  readingTime: ReadTimeResults;
};

export type ClientMeta = {
  slug: string;
  name: string;
  summary: string;
  year: number;
};

export type Client = ClientMeta & {
  code: string;
  readingTime: ReadTimeResults;
};

export type ProjectMeta = {
  slug: string;
  name: string;
  url: string;
  summary: string;
  year: number;
  image: string;
};

export type Project = ProjectMeta & {
  code: string;
  readingTime: ReadTimeResults;
};
