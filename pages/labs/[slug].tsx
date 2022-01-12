import { useMDXComponent } from 'next-contentlayer/hooks';
import components from 'components/MDXComponents';
import ClientLayout from 'layouts/client';
import { allProjects } from '.contentlayer/data';
import type { Project } from '.contentlayer/types';
import ProjectLayout from 'layouts/project';

export default function Post({ project }: { project: Project }) {
  const Component = useMDXComponent(project.body.code);

  return (
    <ProjectLayout project={project}>
      <Component components={{ ...components } as any} />
    </ProjectLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: allProjects.map((p) => ({ params: { slug: p.slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const project = allProjects.find((project) => project.slug === params.slug);

  return { props: { project } };
}
