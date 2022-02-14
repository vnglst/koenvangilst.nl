import components from 'components/MDXComponents';
import type { Project } from 'contentlayer/generated';
import { allProjects } from 'contentlayer/generated';
import ProjectLayout from 'layouts/project';
import { useMDXComponent } from 'next-contentlayer/hooks';

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
