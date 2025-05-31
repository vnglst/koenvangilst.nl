import Avatar from 'app/avatar.jpg';
import Image from 'next/image';
import NextLink from 'next/link';

import { Heading } from 'components/content/Heading';
import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';
import { Link } from 'components/ui/Link';
import { TagLink } from 'components/ui/Tag';

export async function generateMetadata() {
  return {
    title: 'Home | Koen van Gilst',
    description:
      "I'm Koen van Gilst, a software tinkerer and web enthusiast. Here you'll find my articles, coding experiments, side projects, and other work."
  };
}

export default async function Home() {
  return (
    <Container>
      <section className="flex flex-col items-center">
        <NextLink href="/about">
          <Image
            alt="Koen van Gilst"
            height={176}
            width={176}
            src={Avatar}
            className="rounded-full border-4 border-slate-900 grayscale filter dark:border-slate-100"
            priority
          />
        </NextLink>
        <Prose className="flex flex-col items-center">
          <Heading level={1}>Koen van Gilst</Heading>
          <p className="text-center">
            I'm a software tinkerer and web enthusiast who loves bringing beautiful, fun, and educational creations to
            life using code. <Link href="/about">Read more</Link>
          </p>
        </Prose>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <TagLink href="/lab?q=article">articles</TagLink>
          <TagLink href="/lab?q=generative-art">coding experiments</TagLink>
          <TagLink href="/lab?q=side-project">side projects</TagLink>
          <TagLink href="/lab?q=work">work</TagLink>
        </div>
      </section>
    </Container>
  );
}
