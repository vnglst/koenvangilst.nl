import { loadMDXFile, loadMetadataFromDir } from './mdx-parser';
import {
  Client,
  ClientMeta,
  Post,
  PostMeta,
  Project,
  ProjectMeta,
  Snippet,
  SnippetMeta
} from './types';

export async function getPosts() {
  const posts = await loadMetadataFromDir<PostMeta>('data/blog');
  return posts;
}

export async function getPost(slug: string) {
  const post = await loadMDXFile<Post>(slug, 'data/blog');

  if (!post) {
    return;
  }

  return {
    ...post,
    tagsAsSlugs: post.tags
      ? post.tags.map((tag: string) =>
          tag.trim().toLowerCase().split(' ').join('-')
        )
      : []
  };
}

export async function getSnippets() {
  const snippets = await loadMetadataFromDir<SnippetMeta>('data/snippets');
  return snippets;
}

export async function getSnippet(slug: string) {
  const snippet = await loadMDXFile<Snippet>(slug, 'data/snippets');
  return snippet;
}

export async function getClients() {
  const clients = await loadMetadataFromDir<ClientMeta>('data/portfolio');
  return clients;
}

export async function getClient(slug: string) {
  const client = await loadMDXFile<Client>(slug, 'data/portfolio');
  return client;
}

export async function getProjects() {
  const projects = await loadMetadataFromDir<ProjectMeta>('data/labs');
  return projects;
}

export async function getProject(slug: string) {
  const project = await loadMDXFile<Project>(slug, 'data/labs');
  return project;
}
