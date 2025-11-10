// Client-side content loading for React Router

export interface Post {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  tags?: string[];
  tagsAsSlugs?: string[];
  image?: {
    src: string;
    width: number;
    height: number;
  };
  readingTime: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  code?: string;
}

export interface PostMeta extends Omit<Post, 'code'> {}

let postsCache: PostMeta[] | null = null;

export async function getPosts(): Promise<PostMeta[]> {
  if (postsCache) {
    return postsCache;
  }

  try {
    const response = await fetch('/data/posts.json');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts = await response.json();
    postsCache = posts;
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`/data/${slug}.json`);
    if (!response.ok) {
      return null;
    }
    const post = await response.json();
    return post;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

export function getUniqueTagSlugs(posts: PostMeta[]): string[] {
  const tagSlugs = new Set<string>();
  posts.forEach((post) => {
    if (post.tagsAsSlugs) {
      post.tagsAsSlugs.forEach((tag) => tagSlugs.add(tag));
    }
  });
  return Array.from(tagSlugs).sort();
}
