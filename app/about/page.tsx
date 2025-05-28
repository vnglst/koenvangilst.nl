import { Heading } from 'components/content/Heading';
import { Prose } from 'components/content/Prose';
import { Container } from 'components/layout/Container';

export async function generateMetadata() {
  return {
    title: 'About | Koen van Gilst',
    description:
      'Tech Lead at Rabobank with a background in philosophy and lifelong passion for programming. I focus on GenAI impact, team building, and bridging business with technology to deliver real value. Motivated by fostering learning cultures and genuine innovation.'
  };
}

export default async function SideProjects() {
  return (
    <Container>
      <Prose>
        <Heading level={1}>About me</Heading>
        <p>
          My journey with programming started in childhood—experimenting with GW-Basic on my father's new XT-Computer
          during evenings when he'd work from home, then moving on to Turbo Pascal. One memory that stands out is my
          first time connecting to a BBS (bulletin board) using a 2400 baud modem I'd saved up to buy—that moment of
          accessing a whole world of information and community was electrifying. The combination of code and connection
          felt transformative.
        </p>
        <p>
          I followed an unexpected academic route through philosophy, completing my master's thesis title "Francis Bacon
          and the Idea of Scientific Progress". Post-graduation, I spent time as a translator and interpreter in Munich,
          though programming never stopped being my passion.
        </p>
        <p>
          Today I work as a Tech Lead at Rabobank, and my philosophy training & life-long passion for technology
          actually comes in handy. I specialize in cutting through noise to identify where GenAI delivers real impact.
          My role involves running technical pilots, evaluating what's actually feasible, and distinguishing between
          genuine innovation and hype.
        </p>
        <p>
          A significant part of my job centers on team building — finding the right people, developing talent, and
          making sure we have what we need to turn big ideas into working solutions. I bridge the gap between business
          requirements and technical implementation, keeping customer value at the center.
        </p>
        <p>
          What motivates me is fostering environments where teams thrive — culture that celebrates technical
          craftsmanship, embraces learning, and focuses on technology that delivers real value. This philosophy helps
          Rabobank use AI strategically while remaining focused on what genuinely benefits the bank.
        </p>
      </Prose>
    </Container>
  );
}
