import { BackToLab } from '#/components/layout/BackToLab';
import { useRef, useState } from 'react';
import { Container } from '#/components/layout/Container';
import { Heading } from '#/components/content/Heading';
import { Button } from '#/components/ui/Button';
import { GalleryNavigation } from '#/components/ui/GalleryNavigation';
import { Link } from '#/components/ui/Link';

const GENERATIVE_ART_PROJECTS = [
  {
    title: 'Stacked Game of Life',
    url: 'https://stacked-game-of-life.koenvangilst.nl',
    slug: 'stacked-game-of-life'
  },
  {
    title: 'Tetris Time',
    url: 'https://tetris-time.koenvangilst.nl',
    slug: 'tetris-time'
  },
  {
    title: 'Voronoi Virus',
    url: 'https://voronoi-virus.koenvangilst.nl',
    slug: 'voronoi-virus'
  },
  {
    title: 'Dancing Mosquitoes',
    url: 'https://dancing-mosquitoes.koenvangilst.nl',
    slug: 'dancing-mosquitoes'
  },
  {
    title: 'Pong Wars',
    url: 'https://pong-wars.koenvangilst.nl',
    slug: 'pong-wars'
  },
  {
    title: 'Purple Rain',
    url: 'https://purple-rain.koenvangilst.nl',
    slug: 'purple-rain'
  },
  {
    title: 'Particle Life',
    url: 'https://particle-life.koenvangilst.nl/?matrix=-0.02%2C0.15%2C-0.09%2C-0.01%2C0.30%2C-0.87%2C-0.51%2C0.14%2C-0.83%2C0.21%2C-0.73%2C0.39%2C0.84%2C-0.34%2C0.83%2C0.00%2C0.75%2C-0.11%2C-0.35%2C-0.03%2C-0.82%2C-0.97%2C-0.76%2C-0.50%2C-0.32%2C-0.21%2C0.92%2C-0.87%2C0.99%2C-0.86%2C0.78%2C0.17%2C-0.87%2C-0.06%2C-0.49%2C-0.70',
    slug: 'particle-life'
  },
  {
    title: 'Time Flies',
    url: 'https://time-flies.koenvangilst.nl',
    slug: 'time-flies'
  },
  { title: 'Aarde', url: 'https://aarde.koenvangilst.nl', slug: 'aarde' },
  {
    title: 'Rock Paper Scissors',
    url: 'https://rock-paper-scissors.koenvangilst.nl',
    slug: 'rock-paper-scissors'
  }
];

export function GenerativeArtGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const projectIndex = useRef<HTMLDetailsElement>(null);
  const project = GENERATIVE_ART_PROJECTS[currentIndex];
  return (
    <Container wide footer={false} layout="art">
      <BackToLab />
      <Heading>Generative Art Gallery</Heading>
      <div className="art-toolbar">
        <details className="art-index" ref={projectIndex}>
          <summary>All {GENERATIVE_ART_PROJECTS.length} projects</summary>
          <nav aria-label="Choose an art project">
            {GENERATIVE_ART_PROJECTS.map((item, index) => (
              <Button
                variant="bare"
                key={item.slug}
                aria-current={currentIndex === index ? 'true' : undefined}
                onClick={() => {
                  setCurrentIndex(index);
                  if (projectIndex.current) projectIndex.current.open = false;
                }}
              >
                {item.title}
              </Button>
            ))}
          </nav>
        </details>
        <span>
          {currentIndex + 1} / {GENERATIVE_ART_PROJECTS.length}
        </span>
      </div>
      <iframe key={project.slug} src={project.url} title={project.title} className="art-viewport" />
      <div className="art-caption">
        <Heading level={2} size={3}>
          {project.title}
        </Heading>
        <Link href={project.url} variant="plain" externalIndicator={false}>
          Open in new tab ↗
        </Link>
      </div>
      <GalleryNavigation
        label="Art projects"
        previousLabel="Previous art project"
        nextLabel="Next art project"
        previousDisabled={currentIndex === 0}
        nextDisabled={currentIndex === GENERATIVE_ART_PROJECTS.length - 1}
        onPrevious={() => setCurrentIndex(currentIndex - 1)}
        onNext={() => setCurrentIndex(currentIndex + 1)}
      />
    </Container>
  );
}
