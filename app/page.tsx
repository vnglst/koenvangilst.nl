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
      <section className="mb-4 flex flex-col-reverse items-start sm:flex-row">
        <div className="flex flex-col pr-8">
          <Heading level={1}>Koen van Gilst</Heading>
          <div className="mb-4 text-gray-700 dark:text-gray-200">
            Lead Frontend Developer at{' '}
            <span className="font-semibold">Rabobank</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            I'm a passionate and entrepreneurial web developer from the
            Netherlands who likes to push the web beyond its limits.
          </p>
        </div>
        <div className="relative mr-auto mt-4 w-[80px] sm:w-[176px]">
          <Image
            alt="Koen van Gilst"
            height={176}
            width={176}
            src="/avatar.jpg"
            className="rounded-full grayscale filter"
            priority
          />
        </div>
      </section>
      <Heading level={2}>Featured</Heading>
      <section className="flex flex-col gap-6 md:flex-row">
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
        className="item-center mb-12 mt-8 flex h-6 content-center justify-center justify-items-center rounded-lg leading-7 text-gray-600 transition-all hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Read all posts
        <Icon icon="arrow-right" className="ml-1 h-6 w-6" />
      </Link>
    </Container>
  );
}
