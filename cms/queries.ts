import { loadAllMdx, loadSingleMdx } from './mdx-parser';
import { Client, ClientMeta, Post, PostMeta, Project, ProjectMeta, Snippet, SnippetMeta } from './schema';

export async function getPosts() {
  return loadAllMdx<PostMeta>('data/blog', PostMeta);
}

export async function getPost(slug: string) {
  return loadSingleMdx<Post>(slug, 'data/blog', Post);
}

export async function getSnippets() {
  return loadAllMdx<SnippetMeta>('data/snippets', SnippetMeta);
}

export async function getSnippet(slug: string) {
  return loadSingleMdx<Snippet>(slug, 'data/snippets', Snippet);
}

export async function getClients() {
  return loadAllMdx<ClientMeta>('data/portfolio', ClientMeta);
}

export async function getClient(slug: string) {
  return loadSingleMdx<Client>(slug, 'data/portfolio', Client);
}

export async function getProjects() {
  return loadAllMdx<ProjectMeta>('data/labs', ProjectMeta);
}

export async function getProject(slug: string) {
  return loadSingleMdx<Project>(slug, 'data/labs', Project);
}
