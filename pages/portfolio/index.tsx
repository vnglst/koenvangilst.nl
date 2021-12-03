import Container from 'components/Container';
import ClientProject from 'components/ClientProject';
import { pick } from 'lib/utils';
import { allClients } from '.contentlayer/data';
import { InferGetStaticPropsType } from 'next';

export default function Blog({
  clients
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const sorted = clients.sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <Container title="Portolio – Koen van Gilst" description="">
      <article className="flex flex-col items-start justify-center max-w-2xl mx-auto mb-16">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
          Portfolio
        </h1>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {`I've been a freelance web developer since 2013. I've been involved in all sorts of projects, from a CMS for a narrow casting system, to a mobile app for a global retailer and a web app for investment bankers. In most roles the focus has been on creating the frontend (using React), but I also feel confident creating and contributing to backend services (in TypeScript).`}
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {`I enjoy working in a multidisciplinary team and I tend to be focused on shipping features that either have improve the user experience or have a postive impact on the organisations bottom line. I'm teamplayer that likes to help other succeed and become a better developer themselves.`}
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
