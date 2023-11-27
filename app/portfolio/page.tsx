import ClientProject from 'components/ClientProject';
import { Article } from 'ui/Article';
import { Container } from 'ui/Container';
import { Heading } from 'ui/Heading';

import { pick } from 'contentlayer/client';
import { allClients } from 'contentlayer/generated';

const clients = allClients.map((client) =>
  pick(client, ['slug', 'name', 'year', 'summary'])
);

export const metadata = {
  title: 'Portfolio',
  description:
    "Experienced Lead Frontend Developer at Rabobank with a strong background in freelance web development and over a decade of experience. Specialized in React for frontend design and TypeScript for backend API development. Here you'll find some of my most recent clients."
};

export default function Portfolio() {
  const sorted = clients.sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <Container>
      <Heading level={1}>Portfolio</Heading>
      <Article>
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
          coding with Python and Elixir.
        </p>
        <p>
          In 2022, I transitioned from my freelance career to a corporate role,
          taking on the position of Lead Frontend Developer at Rabobank. Here, I
          continue to leverage my skill set, leading innovative projects and
          guiding a team of developers.
        </p>
      </Article>

      <Heading level={2}>Recent projects</Heading>
      {sorted.map((client) => {
        return (
          <ClientProject
            title={client.name}
            year={client.year}
            summary={client.summary}
            slug={client.slug}
            key={client.slug}
          />
        );
      })}
    </Container>
  );
}
