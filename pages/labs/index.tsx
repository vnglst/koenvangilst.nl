import Container from 'components/Container';
import LabProject from 'components/LabProject';
import { pick } from 'contentlayer/client';
import { allProjects } from 'contentlayer/generated';
import { InferGetStaticPropsType } from 'next';

export default function Blog({
  projects
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const sorted = projects.sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <Container
      title="Labs – Koen van Gilst"
      description="A list of JavaScript experiments. Mostly small (educational) apps for my kids or to learn a new technology myself."
    >
      <article className="flex flex-col items-start justify-center max-w-2xl mx-auto mb-16">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
          JavaScript Labs
        </h1>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {`Below, you'll find a collection of my JavaScript experiments. It's mostly educational progressive web apps, some Twitter bots, and other creative stuff. I generally use these experiments to learn more about a certain technology or library, so don't take the code too seriously. 🐒`}
        </p>
        <h3 className="mt-8 mb-8 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
          Side Projects
        </h3>
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
      </article>
    </Container>
  );
}

export function getStaticProps() {
  const projects = allProjects.map((client) =>
    pick(client, ['url', 'name', 'year', 'summary'])
  );

  return { props: { projects } };
}
