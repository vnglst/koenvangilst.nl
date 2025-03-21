import { getProjects } from 'cms/queries';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { ProjectLink } from 'components/ProjectLink';
import { Prose } from 'components/Prose';

export const metadata = {
  title: 'Labs',
  description: 'A list of coding experiments. Mostly small side projects to learn about a new technology.',
  alternates: {
    canonical: 'labs'
  }
};

export default async function Labs() {
  const projects = await getProjects();

  const sorted = [...projects].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <Container>
      <Prose>
        <Heading level={1}>Code Labs</Heading>
        <p>
          Below, you'll find a collection of side projects I've been tinkering with. It's a mix of educational web apps,
          data visualisations and other fun creations. I mainly use these as playgrounds to dive deeper into new tech or
          libraries, so the code is just me having a bit of fun.
        </p>
      </Prose>
      <Heading level={2}>Side projects</Heading>
      {sorted.map((project) => (
        <ProjectLink
          title={project.name}
          publishedAt={project.publishedAt}
          summary={project.summary}
          href={project.url}
          key={project.url}
        />
      ))}
    </Container>
  );
}
