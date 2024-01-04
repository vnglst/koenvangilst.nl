import { getClients } from 'cms/queries';
import Link from 'next/link';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { ProjectLink } from 'components/ProjectLink';
import { Prose } from 'components/Prose';

export const metadata = {
  title: 'Portfolio',
  description:
    "Experienced Lead Frontend Developer at Rabobank with a strong background in freelance web development and over a decade of experience. Specialized in React for frontend design and TypeScript for backend API development. Here you'll find some of my most recent clients."
};

export default async function Portfolio() {
  const sorted = (await getClients()).sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  return (
    <Container>
      <Prose>
        <Heading level={1}>Portfolio</Heading>
        <p>
          Starting my career as a freelance web developer over a decade ago, I
          have participated in a wide array of projects. These include
          developing a mobile application for a well-known global fashion brand,
          creating an audioplayer designed for users with visual impairments,
          and engineering a web application tailored for investment banking
          professionals. My focus has been on frontend development, using the
          power of React to craft user friendly interfaces. In addition to my
          frontend expertise, I am also adept in backend development using
          TypeScript and Node.js. For occasional side projects, I also enjoy in
          coding with Python and Elixir.{' '}
          <Link href="/about">More about me...</Link>
        </p>
        <p>
          In 2022, I transitioned from my freelance career to a corporate role,
          taking on the position of Lead Frontend Developer at Rabobank. Here, I
          continue to leverage my skill set, leading innovative projects and
          guiding a team of developers.
        </p>
      </Prose>

      <Heading level={2}>Recent projects</Heading>
      {sorted.map((client) => {
        return (
          <ProjectLink
            key={client.slug}
            title={client.name}
            year={client.year}
            summary={client.summary}
            href={`/portfolio/${client.slug}`}
          />
        );
      })}
    </Container>
  );
}
