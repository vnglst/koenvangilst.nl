import { loadAllMdx, loadSingleMdx } from './mdx-parser';
import { Post, PostMeta, PostMetaType, PostType } from './schema';

export async function getPosts() {
  return loadAllMdx<PostMetaType>('content', PostMeta);
}

export async function getPost(slug: string) {
  return loadSingleMdx<PostType>(slug, 'content', Post);
}
