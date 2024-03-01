import { Container } from 'components/ContentContainer';
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
          The code of this website is inspired by{' '}
          <a href="https://leerob.io/">Lee Robinsons personal website</a> using
          the following tech stack:
        </p>
        <ul>
          <li>Framework: Next.js</li>
          <li>Deployment: Vercel</li>
          <li>Styling: Tailwind CSS</li>
        </ul>
        <p>
          The source code of this website can be found{' '}
          <a href="https://github.com/vnglst/koenvangilst.nl">on Github</a>.
        </p>
      </Prose>
    </Container>
  );
}
