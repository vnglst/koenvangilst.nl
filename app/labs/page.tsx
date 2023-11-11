import LabProject from 'components/LabProject';

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
    <article className="flex flex-col items-start justify-center max-w-2xl mx-auto mb-16">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
        JavaScript Labs
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Below, you'll find a collection of JavaScript projects I've been
        tinkering with. You'll see a mix of educational progressive web apps, a
        couple of Twitter bots, and some other fun creations. I mainly use these
        as playgrounds to dive deeper into new tech or libraries, so the code is
        just me having a bit of fun. Nothing too formal! 🐒
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
  );
}
