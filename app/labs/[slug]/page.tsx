import { getProject, getProjects } from 'cms/queries';
import { notFound } from 'next/navigation';

import { MarkdownLayout } from 'components/MarkdownLayout';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <MarkdownLayout
      publishedAt={project.publishedAt.toString()}
      title={project.name}
      readingTime={project.readingTime}
      path={'/labs/' + project.slug}
      code={project.code}
    />
  );
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const project = await getProject(params.slug);

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

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => {
    return {
      slug: project.slug
    };
  });
}
