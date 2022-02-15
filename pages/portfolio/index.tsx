import ClientProject from 'components/ClientProject';
import Container from 'components/Container';
import { allClients } from 'contentlayer/generated';
import { pick } from 'lib/utils';
import { InferGetStaticPropsType } from 'next';

export default function Blog({
  clients
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const sorted = clients.sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <Container
      title="Portolio – Koen van Gilst"
      description="I've been a freelance web dev since 2013 and I've been involved in all sorts of projects. Here you'll find some of my most recent clients."
    >
      <article className="flex flex-col items-start justify-center max-w-2xl mx-auto mb-16">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
          Portfolio
        </h1>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {`I've been a freelance web developer since 2013. I've been involved in all sorts of projects, from a CMS for a narrow casting system to a mobile app for a global fashion retailer and a web app for investment bankers. In most roles the focus has been on creating the frontend (using React), but I also feel confident creating and contributing to backend API's (in TypeScript).`}
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
    </Container>
  );
}

export function getStaticProps() {
  const clients = allClients.map((client) =>
    pick(client, ['slug', 'name', 'year', 'summary'])
  );

  return { props: { clients } };
}
