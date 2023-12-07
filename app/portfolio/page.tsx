import { getClients } from 'cms/queries';
import Link from 'next/link';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
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
          coding with Python and Elixir.
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

type Props = {
  title: string;
  summary: string;
  slug: string;
  year: number;
};

function ProjectLink({ title, summary, slug, year }: Props) {
  return (
    <Link href={`/portfolio/${slug}`} className="w-full">
      <article className="up-hover mb-4 w-full py-3">
        <div className="flex items-baseline">
          <div className="leading-2  mr-6 text-left text-primary">{year}</div>
          <div className="w-full">
            <div className="flex flex-col justify-between md:flex-row">
              <h4 className="mb-2 w-full text-lg font-medium text-gray-900 dark:text-gray-100 md:text-xl">
                {title}
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{summary}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
