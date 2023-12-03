import LabProject from 'components/LabProject';
import { Article } from 'ui/Article';
import { Container } from 'ui/Container';
import { Heading } from 'ui/Heading';

import { pick } from 'contentlayer/client';
import { allProjects } from 'contentlayer/generated';

const projects = allProjects.map((client) =>
  pick(client, ['url', 'name', 'year', 'summary'])
);

export const metadata = {
  title: 'Labs',
  description:
    'A list of JavaScript experiments. Mostly small (educational) apps for my kids or to learn a new technology myself.',
  alternates: {
    canonical: 'labs'
  }
};

export default function Labs() {
  const sorted = projects.sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <Container>
      <Article>
        <Heading level={1}>JavaScript Labs</Heading>
        <p>
          Below, you'll find a collection of JavaScript projects I've been
          tinkering with. You'll see a mix of educational progressive web apps,
          a couple of Twitter bots, and some other fun creations. I mainly use
          these as playgrounds to dive deeper into new tech or libraries, so the
          code is just me having a bit of fun. Nothing too formal! 🐒
        </p>
      </Article>
      <Heading level={2}>Side projects</Heading>
      {sorted.map((client) => {
        return (
          <LabProject
            title={client.name}
            year={client.year}
            summary={client.summary}
            url={client.url}
            key={client.url}
          />
        );
      })}
    </Container>
  );
}
