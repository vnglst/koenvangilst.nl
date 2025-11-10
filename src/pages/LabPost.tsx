import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { MarkdownLayout } from 'components/content/MarkdownLayout';

import { getPost, Post } from '../lib/content';
import { NotFound } from './NotFound';

export function LabPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [additionalComponents, setAdditionalComponents] = useState<any>({});

  useEffect(() => {
    if (!slug) return;

    getPost(slug).then((data) => {
      setPost(data);

      // Try to load additional components for this post
      import(`../../content/${slug}.components.js`)
        .then((module) => {
          setAdditionalComponents(module);
        })
        .catch((e) => {
          // It's okay if there are no additional components
          console.log(`No additional components for ${slug}`);
        });
    });
  }, [slug]);

  if (post === undefined) {
    return <div>Loading...</div>;
  }

  if (post === null || !slug) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Koen van Gilst</title>
        <meta name="description" content={post.summary} />
        {post.image?.src && <meta property="og:image" content={`https://koenvangilst.nl${post.image.src}`} />}
      </Helmet>
      <MarkdownLayout
        publishedAt={post.publishedAt}
        title={post.title}
        readingTime={post.readingTime}
        tags={post.tags}
        path={'/' + post.slug}
        image={post.image ? { ...post.image, alt: post.title } : undefined}
        code={post.code || ''}
        additionalComponents={additionalComponents}
      />
    </>
  );
}
