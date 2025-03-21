import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';

export const metadata = {
  title: 'About',
  description:
    'Tech Lead at Rabobank with a philosophy degree and passion for technology. I drive innovation, build teams, and apply GenAI to simplify banking. Committed to fostering an engineering culture that values expertise and continuous learning.'
};

export default async function Portfolio() {
  return (
    <Container>
      <Prose>
        <Heading level={1}>About</Heading>
        <p>
          I've had a long multifaceted career, with a degree in philosophy and a lifelong interest in technology and
          coding. My journey has taken me from the early days of hands-on coding to a leadership role where I not only
          experiment with new ideas but also build and support innovative teams.Today, as a Tech Lead at Rabobank, I'm
          driven by a clear mission: to build a better bank by fighting complexity and applying GenAI when it makes
          sense.
        </p>
        <p>
          To do this I experiment with new ideas around GenAI and design early-stage technical tests to ensure solutions
          are feasible. I build and support teams, recruit talent, and secure the necessary resources to move our
          projects forward. By working closely with business lines and other technical stakeholders in the bank, I make
          sure technical strategies are aligned with product goals, and I guide projects from initial experimentation to
          a successful MVP.
        </p>
        <p>
          At the core of my work is a commitment to stimulating an engineering culture that values craftsmanship,
          technical expertise, and continuous learning. I strive to create environments where teams are empowered to use
          the right technological solutions, enabling them to excel and help the Rabobank innovate with AI.
        </p>
      </Prose>
    </Container>
  );
}
