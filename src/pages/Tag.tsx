import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { Container } from 'components/layout/Container';
import { PostLink } from 'components/ui/PostLink';

import { getPosts, PostMeta } from '../lib/content';
import { NotFound } from './NotFound';

export function Tag() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    getPosts().then((allPosts) => {
      const filteredPosts = allPosts.filter((p) => p.tagsAsSlugs?.includes(slug));
      setPosts(filteredPosts);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (posts.length === 0) {
    return <NotFound />;
  }

  const tagName = posts[0].tags?.find((t) => t.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-') === slug) || slug;

  return (
    <>
      <Helmet>
        <title>Posts tagged with "{tagName}" | Koen van Gilst</title>
        <meta name="description" content={`All posts tagged with ${tagName}`} />
      </Helmet>
      <Container>
        <h1 className="mb-8 text-3xl font-bold">Posts tagged with "{tagName}"</h1>
        <div className="space-y-4">
          {posts.map((post) => (
            <PostLink key={post.slug} {...post} />
          ))}
        </div>
      </Container>
    </>
  );
}
