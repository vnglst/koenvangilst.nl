import { getClients } from 'cms/queries';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { ProjectLink } from 'components/ProjectLink';
import { Prose } from 'components/Prose';

export const metadata = {
  title: 'Portfolio',
  description:
    'Tech Lead at Rabobank with a background in web development and over a decade of experience. Specialized in GenAI, React for frontend design and TypeScript for backend API development.'
};

export default async function Portfolio() {
  const sorted = (await getClients()).sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <Container>
      <Prose>
        <Heading level={1}>Portfolio</Heading>
        <p>
          As Tech Lead GenAI at Rabobank, I lead the technical development of AI-driven solutions, overseeing projects
          and collaborating with cross-functional teams. My background includes web development experience across
          diverse projects, from mobile apps for global fashion brands to specialized applications for investment
          banking. I've focused primarily on frontend development with React & Angular while maintaining skills in
          backend technologies like Python, TypeScript, and Node.js.
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
