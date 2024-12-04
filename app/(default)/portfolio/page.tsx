import { getClients } from 'cms/queries';
import Link from 'next/link';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { ProjectLink } from 'components/ProjectLink';
import { Prose } from 'components/Prose';

export const metadata = {
  title: 'Portfolio',
  description:
    'Experienced Tech Lead at Rabobank with a background in web development and over a decade of experience. Specialized in GenAI, React for frontend design and TypeScript for backend API development.'
};

export default async function Portfolio() {
  const sorted = (await getClients()).sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <Container>
      <Prose>
        <Heading level={1}>Portfolio</Heading>
        <p>
          I began my career as a freelance web developer over a decade ago, working on diverse projects such as
          developing a mobile app for a global fashion brand, designing an audio player for users with visual
          impairments, and engineering a web application for investment banking professionals. My primary focus has been
          on frontend development, utilizing React to create intuitive user interfaces. Beyond frontend work, I am
          skilled in backend development with Python, TypeScript and Node.js and enjoy experimenting with Elixir for
          side projects. <Link href="/about">More about me...</Link>
        </p>
        <p>
          In 2022, I transitioned from freelancing to a corporate setting as the Lead Frontend Developer at Rabobank.
          Building on this experience, I now work as the Tech Lead GenAI, where I lead the technical development of
          GenAI-driven solutions. In this role, I oversee technical projects and collaborate with cross-functional teams
          to advance sustainable agriculture through innovative technology.
        </p>
      </Prose>

      <Heading level={2}>Recent projects</Heading>
      {sorted.map((client) => {
        return (
          <ProjectLink
            key={client.slug}
            title={client.name}
            publishedAt={client.year + '-01-01'}
            summary={client.summary}
            href={`/portfolio/${client.slug}`}
          />
        );
      })}
    </Container>
  );
}
