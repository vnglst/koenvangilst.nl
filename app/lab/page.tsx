import { getPosts } from 'cms/mdx-parser';

import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';

import { ProjectBrowser } from './project-browser';

export async function generateMetadata() {
  return {
    title: 'Labs',
    description: "Koen van Gilst's coding laboratory, a collection of coding experiments, articles, and side projects."
  };
}

export default async function Labs() {
  const posts = await getPosts();
  const sortedPosts = [...posts].sort((a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)));

  return (
    <Container>
      <Prose>
        <p>
          Below, you'll find a collection of coding experiments, blog posts and side projects I've been thinkering with.
          It's a mix of educational web apps, tutorials, data visualisations and creations just for fun.
        </p>
      </Prose>
      <ProjectBrowser projects={sortedPosts} />
    </Container>
  );
}
