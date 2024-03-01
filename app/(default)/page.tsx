import Image from 'next/image';
import Link from 'next/link';

import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { Icon } from 'components/Icon';
import { ViewCount } from 'components/ViewCount';

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
        <FeaturedCard
          title="Rising Temperatures in The Netherlands"
          path="/blog/rising-temperatures"
        />
        <FeaturedCard
          title="Why I Prefer Trunk-Based Development"
          path="/blog/trunkbased-development"
        />
        <FeaturedCard
          title="Code Colocation is King"
          path="/blog/code-colocation-is-king"
        />
      </section>
      <Link
        href="/blog"
        className="align-center my-8 flex w-fit text-gray-600 transition-all hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Read all posts
        <Icon icon="arrow-right" className="ml-1 h-6 w-6" />
      </Link>
    </Container>
  );
}

type FeatureCardProps = {
  title: string;
  path: string;
};

async function FeaturedCard({ title, path }: FeatureCardProps) {
  return (
    <Link
      href={path}
      className="rounded-xl border border-dashed border-gray-400 bg-gray-50 p-6 md:w-1/3 dark:bg-black"
    >
      <div className="up-hover flex h-full w-full flex-col justify-between">
        <h3 className="mb-4 w-full text-lg font-medium tracking-tight text-gray-900 md:mb-6 md:text-lg dark:text-gray-100">
          {title}
        </h3>
        <div className="flex items-center text-gray-800 dark:text-gray-200">
          <Icon icon="eye" className="h-6 w-6" />
          <ViewCount className="ml-2 align-baseline" path={path} />
        </div>
      </div>
    </Link>
  );
}
