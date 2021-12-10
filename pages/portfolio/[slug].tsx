import { useMDXComponent } from 'next-contentlayer/hooks';
import components from 'components/MDXComponents';
import ClientLayout from 'layouts/client';
import { allClients } from '.contentlayer/data';
import type { Client } from '.contentlayer/types';

export default function Post({ client }: { client: Client }) {
  const Component = useMDXComponent(client.body.code);

  return (
    <ClientLayout client={client}>
      <Component components={{ ...components } as any} />
    </ClientLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: allClients.map((p) => ({ params: { slug: p.slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const client = allClients.find((client) => client.slug === params.slug);

  return { props: { client } };
}
