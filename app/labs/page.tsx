import { getProjects } from 'cms/queries';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { ProjectLink } from 'components/ProjectLink';
import { Prose } from 'components/Prose';

export const metadata = {
  title: 'Labs',
  description:
    'A list of JavaScript experiments. Mostly small (educational) apps for my kids or to learn a new technology myself.',
  alternates: {
    canonical: 'labs'
  }
};

export default async function Labs() {
  const sorted = (await getProjects()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <Container>
      <Prose>
        <Heading level={1}>JavaScript Labs</Heading>
        <p>
          Below, you'll find a collection of JavaScript projects I've been tinkering with. You'll see a mix of
          educational progressive web apps, a couple of Twitter bots, and some other fun creations. I mainly use these
          as playgrounds to dive deeper into new tech or libraries, so the code is just me having a bit of fun. Nothing
          too formal! 🐒
        </p>
      </Prose>
      <Heading level={2}>Side projects</Heading>
      {sorted.map((project) => {
        return (
          <ProjectLink
            title={project.name}
            publishedAt={project.publishedAt}
            summary={project.summary}
            href={project.url}
            key={project.url}
          />
        );
      })}
    </Container>
  );
}
