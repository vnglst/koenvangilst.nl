import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer/hooks';

import components from 'components/MDXComponents';
import { Container } from 'ui/Container';
import { Heading } from 'ui/Heading';
import { Prose } from 'ui/Prose';

import { allProjects } from 'contentlayer/generated';

export default function Project({ params }: { params: { slug: string } }) {
  const project = findProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const Component = getMDXComponent(project.body.code);

  return (
    <Container>
      <Heading level={1}>{project.name}</Heading>
      <div className="mb-6 mt-2 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
        <div className="flex items-center">
          <Image
            alt="Koen van Gilst"
            height={24}
            width={24}
            src="/avatar.jpg"
            className="rounded-full"
            priority
          />
          <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            {'Koen van Gilst / '}
            {project.year}
          </p>
        </div>
        <p className="min-w-32 mt-2 text-sm text-gray-600 dark:text-gray-400 md:mt-0">
          {project.readingTime.text}
        </p>
      </div>
      <Prose as="section">
        <Component components={components} />
      </Prose>
    </Container>
  );
}

function findProjectBySlug(slug: string) {
  return allProjects.find((project) => project.slug === slug);
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const project = findProjectBySlug(params.slug);

  return {
    title: `${project?.name}`,
    description: project?.summary,
    openGraph: {
      images: `https://koenvangilst.nl${project?.image}`
    },
    alternates: {
      canonical: 'labs/' + project?.slug
    }
  };
}

export function generateStaticParams() {
  return allProjects.map((project) => project.slug);
}
