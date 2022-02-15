import components from 'components/MDXComponents';
import type { Blog } from 'contentlayer/generated';
import { allBlogs } from 'contentlayer/generated';
import BlogLayout from 'layouts/blog';
import { useMDXComponent } from 'next-contentlayer/hooks';

export default function Post({ post }: { post: Blog }) {
  const Component = useMDXComponent(post.body.code);

  return (
    <BlogLayout post={post}>
      <Component components={{ ...components }} />
    </BlogLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: allBlogs.map((p) => ({ params: { slug: p.slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const post = allBlogs.find((post) => post.slug === params.slug);

  return { props: { post } };
}
