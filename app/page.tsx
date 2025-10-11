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
      <Prose className="-mt-[5px]">
        <p>
          I'm a software tinkerer and web enthusiast who loves bringing beautiful, fun, and educational creations to
          life using code.
        </p>

        <p>
          I have a diverse background, always at the intersection of technology and humanity, with a philosophy degree
          and a lifelong passion for coding. I started programming at around 11, using GW-Basic and Turbo Pascal. After
          my studies and working as a translator for years, I returned to programming as a web developer. Now I am in a
          technical leadership role where I experiment with new AI ideas and build teams.
        </p>

        <p>
          I currently work at <Link href="https://www.rabobank.com">Rabobank</Link>, where I help users getting their
          work done faster and with less friction. To do this I experiment with GenAI by building technical prototypes
          and collaborating closely with business stakeholders and engineers, guiding projects from initial
          experimentation to successful products in the hands of our users.
        </p>

        <p>
          So far, my work aligns with my passion for technology. In my spare time, I enjoy coding side projects that
          often complement my professional work - a great way to stay up to date with trends and keep learning. On this
          website, you'll find a selection of my <Link href="/lab?q=side-project">side projects</Link>,{' '}
          <Link href="/lab?q=article">articles</Link>, and <Link href="/lab?q=generative-art">generative art</Link> from
          over the years.
        </p>
      </Prose>
    </Container>
  );
}
