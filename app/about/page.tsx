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
          Hi, I'm Koen van Gilst. I've had a diverse career, always at the intersection of technology and humanity, with
          a philosophy degree and a lifelong passion for coding. I started with programming at around 11, using GW-Basic
          and Turbo Pascal. After my studies and working as a translator for a few years, I returned to programming as a
          frontend engineer, and now to a technical leadership role where I experiment with new ideas and build
          innovative teams.
        </p>
        <p>
          At <Link href="https://www.rabobank.nl">Rabobank</Link> I'm focused on building a better bank by applying AI
          where it makes sense. I experiment with Large Language Models and design technical prototypes to validate
          solutions. My main goal is always to make users happy and GenAI offers a unique opportunity to make their
          daily working lives easier and more fun. To achieve this I collaborate closely with business stakeholders and
          engineers to align our strategies with product goals, guiding projects from initial experimentation to
          successful products in the hands of our users.
        </p>
        <p>
          Central to my work is stimulating an engineering culture that values craftsmanship, technical expertise, and
          continuous learning. I feel strongly that many of today's innovations (like GenAI) are technology driven,
          which means that technical experts need to be there when solutions are proposed and discussed. That's why I
          strive to ensure technical teams are empowered to use the right technological solutions, enabling them to help
          the Rabobank innovate with AI.
        </p>
        <p>
          My work aligns with my passion for technology. In my spare time, I enjoy coding side projects that often
          complement my professional work - a great way to stay up to date with trends and keep learning. On this
          website, you'll find a selection of my <Link href="/lab?q=side-project">side projects</Link> and other digital
          creations from over the years.
        </p>
      </Prose>
    </Container>
  );
}
