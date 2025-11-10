import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';

import { ProjectBrowser } from '../../app/lab/project-browser';
import { getPosts, PostMeta } from '../lib/content';

export function Lab() {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then((data) => {
      const sortedPosts = [...data].sort(
        (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
      );
      setPosts(sortedPosts);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Container>
        <Prose>
          <p>Loading...</p>
        </Prose>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Labs | Koen van Gilst</title>
        <meta
          name="description"
          content="Koen van Gilst's coding laboratory, a collection of coding experiments, articles, and side projects."
        />
      </Helmet>
      <Container>
        <Prose>
          <p>
            Below, you'll find a collection of coding experiments, blog posts and side projects I've been thinkering
            with. It's a mix of educational web apps, tutorials, data visualisations and creations just for fun.
          </p>
        </Prose>
        <ProjectBrowser projects={posts as any} />
      </Container>
    </>
  );
}
