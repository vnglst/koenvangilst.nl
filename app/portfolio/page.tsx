import ClientProject from 'components/ClientProject';

import { pick } from 'contentlayer/client';
import { allClients } from 'contentlayer/generated';

const clients = allClients.map((client) =>
  pick(client, ['slug', 'name', 'year', 'summary'])
);

export const metadata = {
  title: 'Portfolio',
  description:
    "Experienced Lead Frontend Developer at Rabobank with a strong background in freelance web development since 2013. Specialized in React for frontend design and TypeScript for backend API development. Here you'll find some of my most recent clients."
};

export default function Portfolio() {
  const sorted = clients.sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <article className="flex flex-col items-start justify-center max-w-2xl mx-auto mb-16">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
        Portfolio
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Beginning my journey as a freelance web developer in 2013, I have been
        involved in a multitude of projects, including the development of a
        mobile application for a prestigious global fashion retailer, an
        audioplayer for user with visual impairments and a web application for
        investment banking professionals. My focus has predominantly been on
        frontend development, harnessing the power of React to craft user
        friendly interfaces. In addition to my frontend expertise, I am also
        adept in backend development using TypeScript and enjoy working with
        Python and Elixir for occasional side projects.
      </p>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        In 2022, I transitioned from my freelance career to a corporate role,
        taking on the position of Lead Frontend Developer at Rabobank. Here, I
        continue to leverage my skill set, leading innovative projects and
        guiding a team of developers.
      </p>

      <h3 className="mt-8 mb-8 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
        Recent projects
      </h3>
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
    </article>
  );
}
