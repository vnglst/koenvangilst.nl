import { createFileRoute } from '@tanstack/react-router';
import { Container } from '#/components/layout/Container';
import { PageHeader } from '#/components/layout/PageHeader';
import { Heading } from '#/components/content/Heading';

const talks = [
  {
    title: 'Growing a better world. Together with AI?',
    event: 'Frontmania',
    date: '2026-10-07',
    displayDate: '7 October 2026',
    description:
      'On building creative things with code, what AI means for our skills and creativity, and a future where engineers are enhanced by AI.'
  },
  {
    title: 'Evals under Pressure',
    event: 'Rockstars Valley',
    date: '2026-10-06',
    displayDate: '6 October 2026',
    description: 'How we use evaluations at Rabobank to build useful and trustworthy AI solutions.'
  },
  {
    title: 'Agentic AI at Rabobank',
    event: 'Rabobank Engineer’s Week',
    date: '2026-04-14',
    displayDate: '14 April 2026',
    description: 'How agentic AI helps relationship managers research and prepare for client conversations.'
  },
  {
    title: 'The Future of Software Engineering',
    event: 'AI Circle',
    date: '2026-03-30',
    displayDate: '30 March 2026',
    description: 'Vibe coding, AI-assisted development, and how the role of the software engineer is changing.'
  }
];

export const Route = createFileRoute('/talks')({
  head: () => ({
    meta: [
      { title: 'Talks | Koen van Gilst' },
      { name: 'description', content: 'Talks on software engineering, creativity, and building with AI.' }
    ],
    links: [{ rel: 'canonical', href: 'https://koenvangilst.nl/talks' }]
  }),
  component: Talks
});

function Talks() {
  return (
    <Container>
      <PageHeader title="Talks" />
      <ol className="talk-list">
        {talks.map((talk) => (
          <li key={talk.date}>
            <article className="talk-entry">
              <div className="talk-context">
                <span>{talk.event}</span>
                <time dateTime={talk.date}>{talk.displayDate}</time>
              </div>
              <Heading level={2} size={3}>
                {talk.title}
              </Heading>
              <p>{talk.description}</p>
            </article>
          </li>
        ))}
      </ol>
    </Container>
  );
}
