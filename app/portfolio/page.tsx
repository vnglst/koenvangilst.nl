import ClientProject from 'components/ClientProject';

import { pick } from 'contentlayer/client';
import { allClients } from 'contentlayer/generated';

const clients = allClients.map((client) =>
  pick(client, ['slug', 'name', 'year', 'summary'])
);

export const metadata = {
  title: 'Portfolio',
  description:
    "I've been a freelance web developer since 2013 and have been involved in all sorts of projects. Here you'll find some of my most recent clients."
};

export default function Portfolio() {
  const sorted = clients.sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <article className="flex flex-col items-start justify-center max-w-2xl mx-auto mb-16">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
        Portfolio
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        {`I've been a freelance web developer since 2013 and have been involved in all sorts of projects, from a CMS for a narrowcasting system to a mobile app for a global fashion retailer and a web app for investment bankers. In most roles, the focus has been on creating the frontend (using React), but I also feel confident creating and contributing to backend APIs (in TypeScript).`}
      </p>
      <h3 className="mt-8 mb-8 text-2xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
        Recent client projects
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
