import { Heading } from 'components/content/Heading';
import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';
import { Link } from 'components/ui/Link';

export async function generateMetadata() {
  return {
    title: 'Koen van Gilst',
    description:
      'Tech Lead at Rabobank with a background in philosophy and lifelong passion for programming. I focus on AI, team building, and bridging business with technology to deliver real value.'
  };
}

export default async function Home() {
  return (
    <Container>
      <Heading level={1}>Koen van Gilst</Heading>
      <Prose>
        <p>
          I'm a software engineer with a philosophy degree and a lifelong passion for creating software - two interests
          that have shaped how I think about technology. I started programming around 11 with GW-Basic and Turbo Pascal,
          and even though I've pursued many other interests since, my fascination has never faded. After many years as a
          web developer, I'm now in a technical leadership role helping teams build software with AI.
        </p>

        <p>
          On this website, you'll find a selection of my <Link href="/lab?q=side-project">side projects</Link>,{' '}
          <Link href="/lab?q=article">articles</Link>, and <Link href="/lab/gen-art-gallery">generative art</Link>. I'm
          particularly proud of two recent projects:{' '}
          <Link href="https://pelican.koenvangilst.nl">Pelican Art Gallery</Link>, a gallery comparing how different AI
          models (2022–2025) recreate famous paintings as SVG code, and{' '}
          <Link href="https://onsland.koenvangilst.nl">Ons Land</Link>, an interactive hexagonal map visualization
          comparing land use across European countries.
        </p>
      </Prose>
    </Container>
  );
}
