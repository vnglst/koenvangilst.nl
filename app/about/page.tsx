import { Heading } from 'components/content/Heading';
import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';
import { Link } from 'components/ui/Link';

export async function generateMetadata() {
  return {
    title: 'About | Koen van Gilst',
    description:
      'Tech Lead at Rabobank with a background in philosophy and lifelong passion for programming. I focus on AI, team building, and bridging business with technology to deliver real value. Motivated by fostering learning cultures and innovation based on curiosity.'
  };
}

export default async function About() {
  return (
    <Container>
      <Prose>
        <Heading level={1}>About me</Heading>
        <p>
          Hi, I'm Koen van Gilst. I've had a diverse career, always operating at the intersection of technology and
          humanity, with a philosophy degree and a lifelong passion for coding. My journey started with programming at
          an early age, using <Link href="https://en.wikipedia.org/wiki/GW-BASIC">GW-Basic</Link> and{' '}
          <Link href="https://en.wikipedia.org/wiki/Turbo_Pascal">Turbo Pascal</Link>. After my studies and working as a
          translator for a few years, I returned to programming as a frontend engineer, and now to a leadership role
          where I experiment with new ideas and build innovative teams.
        </p>
        <p>
          Today, as a Tech Lead at <Link href="https://www.rabobank.nl">Rabobank</Link>, I'm working to build a better
          bank by reducing complexity and applying AI where it makes sense. I experiment with AI (primarily Large
          Language Models) and design technical tests to validate potential solutions. My role involves building and
          supporting teams, recruiting talent, and securing resources to drive projects forward. I collaborate closely
          with business stakeholders and engineers to align our strategies with product goals, guiding projects from
          initial experimentation to successful MVPs.
        </p>
        <p>
          At the core of my work is a commitment to stimulating an engineering culture that values craftsmanship,
          technical expertise, and continuous learning. I strive to create environments where teams are empowered to use
          the right technological solutions, enabling them to excel and help the Rabobank innovate with AI.
        </p>
        <p>
          My work aligns perfectly with my passion for technology. In my spare time, I enjoy coding side projects that
          often complement my professional work - a great way to stay current with trends and keep learning (though it
          can be a double-edged sword). On this website, you'll find a selection of my{' '}
          <Link href="/lab?q=side-project">side projects</Link> and other digital creations from over the years.
        </p>
      </Prose>
    </Container>
  );
}
