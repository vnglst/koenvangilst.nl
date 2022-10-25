import Image from 'next/image';

import Container from 'components/Container';
import type { PropsWithChildren } from 'react';
import { Project } from 'contentlayer/generated';

export default function ProjectLayout({
  children,
  project
}: PropsWithChildren<{ project: Project }>) {
  return (
    <Container
      title={`${project.name} – Koen van Gilst`}
      description={project.summary}
      image={`https://koenvangilst.nl${project.image}`}
    >
      <article className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-16">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
          {project.name}
        </h1>
        <div className="flex flex-col items-start justify-between w-full mt-2 md:flex-row md:items-center">
          <div className="flex items-center">
            <Image
              alt="Koen van Gilst"
              height={24}
              width={24}
              src="/avatar.jpg"
              className="rounded-full"
            />
            <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {'Koen van Gilst / '}
              {project.year}
            </p>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 min-w-32 md:mt-0">
            {project.readingTime.text}
          </p>
        </div>
        <section className="w-full mt-4 prose dark:prose-dark max-w-none">
          {children}
        </section>
      </article>
    </Container>
  );
}
