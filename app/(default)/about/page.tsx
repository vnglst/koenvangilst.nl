import { Container } from 'components/Container';
import { Heading } from 'components/Heading';
import { Prose } from 'components/Prose';

export const metadata = {
  title: 'About',
  openGraph: {
    type: 'article'
  },
  alternates: {
    canonical: 'about'
  }
};

export default function About() {
  return (
    <Container>
      <Prose>
        <Heading level={1}>About Me</Heading>
        <p>
          Hello! I'm Koen, an enthusiastic and entrepreneurial Tech Lead from the Netherlands who's into building GenAI
          apps that users love. Recently, I started on a new journey with Rabobank, stepping into the role of Tech Lead
          for GenAI. In this position, my aim is to guide others through Rabobank's sometimes complex environment,
          fostering a community where developers can easily seek assistance, engage in code reviews and collectively
          grow. Of course, I'll continue coding myself – an aspect of my career that I love and wouldn't dream of giving
          up!
        </p>
        <p>
          If you want to discuss an opportunity with me, feel free to{' '}
          <a className="text-primary" href="/15">
            reach out
          </a>
          . Sometimes I'm available for hire for advice, mentoring or consulting.
        </p>
      </Prose>
    </Container>
  );
}
