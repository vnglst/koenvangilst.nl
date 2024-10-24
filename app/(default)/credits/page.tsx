import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';

export const metadata = {
  title: 'Credits',
  alternates: {
    canonical: 'credits'
  }
};

export default function Credits() {
  return (
    <Container centered>
      <Prose>
        <Heading level={1}>Credits</Heading>
        <p>
          The code of this website was inspired by <a href="https://leerob.io/">Lee Robinsons</a> personal website using
          the following tech stack:
        </p>
        <ul>
          <li>Framework: Next.js</li>
          <li>
            Deployment: <a href="https://coolify.io/docs/">Coolify</a>
          </li>
          <li>
            Hosting: <a href="https://www.hetzner.com/">Hetzner</a>
          </li>
          <li>Styling: Tailwind</li>
        </ul>
        <p>
          The source code of this website can be found <a href="https://github.com/vnglst/koenvangilst.nl">on Github</a>
          .
        </p>
      </Prose>
    </Container>
  );
}
