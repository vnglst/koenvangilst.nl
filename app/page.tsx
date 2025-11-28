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
          I'm a software engineer and web enthusiast who loves bringing beautiful, fun, and educational creations to
          life using code.
        </p>

        <p>
          I have a diverse background, always at the intersection of technology and humanity, with a philosophy degree
          and a lifelong passion for coding. I started programming at around 11, using GW-Basic and Turbo Pascal. After
          working as a web developer for many years I'm now in a technical leadership role where I'm enabling teams 
          to innovate with AI.
        </p>

        <p>
          In my spare time, I enjoy coding side projects that often complement my professional
          work - a great way to stay up to date with trends and keep learning. On this
          website, you'll find a selection of my <Link href="/lab?q=side-project">side projects</Link>,{' '}
          <Link href="/lab?q=article">articles</Link>, and <Link href="/lab/gen-art-gallery">generative art</Link> from
          over the years.
        </p>

        <p>
          I'm particularly proud of two recent projects: <Link href="https://pelican.koenvangilst.nl">Pelican</Link>,
          which tracks how AI models have evolved in recreating famous artworks using only SVG code, and{' '}
          <Link href="https://onsland.koenvangilst.nl">Ons Land</Link>, an interactive visualization exploring
          land use across the Netherlands.
        </p>
      </Prose>
    </Container>
  );
}
