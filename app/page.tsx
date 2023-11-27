import Image from 'next/image';
import Link from 'next/link';

import BlogPostCard from 'components/BlogPostCard';
import { Container } from 'ui/Container';
import { Heading } from 'ui/Heading';
import Icon from 'ui/Icon';

export const revalidate = 60;

export default function Home() {
  return (
    <Container centered>
      <article className="flex flex-col-reverse sm:flex-row items-start mb-4">
        <div className="flex flex-col pr-8">
          <Heading level={1}>Koen van Gilst</Heading>
          <div className="text-gray-700 dark:text-gray-200 mb-4">
            Lead Frontend Developer at{' '}
            <span className="font-semibold">Rabobank</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            I'm a passionate and entrepreneurial web developer from the
            Netherlands who likes to push the web beyond its limits.
          </p>
        </div>
        <div className="w-[80px] sm:w-[176px] relative mr-auto mt-4">
          <Image
            alt="Koen van Gilst"
            height={176}
            width={176}
            src="/avatar.jpg"
            className="rounded-full filter grayscale"
            priority
          />
        </div>
      </article>
      <Heading level={2}>Featured</Heading>
      <section className="flex gap-6 flex-col md:flex-row">
        <BlogPostCard
          title="Why I Prefer Trunk-Based Development"
          slug="trunkbased-development"
        />
        <BlogPostCard
          title="Code Colocation is King"
          slug="code-colocation-is-king"
        />
        <BlogPostCard
          title="Live user cursors with Phoenix Presence"
          slug="phoenix-live-cursors"
        />
      </section>
      <Link
        href="/blog"
        className="flex content-center justify-center justify-items-center item-center mt-8 text-gray-600 dark:text-gray-400 leading-7 rounded-lg hover:text-gray-800 dark:hover:text-gray-200 transition-all h-6 mb-12"
      >
        Read all posts
        <Icon icon="arrow-right" className="h-6 w-6 ml-1" />
      </Link>
    </Container>
  );
}
