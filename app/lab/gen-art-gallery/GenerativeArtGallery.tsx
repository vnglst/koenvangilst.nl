'use client';

import { useEffect, useRef, useState } from 'react';

import { BackButton } from 'components/ui/BackButton';
import { Button } from 'components/ui/Button';
import { Icon } from 'components/ui/Icon';

const GENERATIVE_ART_PROJECTS = [
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
  {
    title: 'Aarde',
    url: 'https://aarde.koenvangilst.nl',
    slug: 'aarde'
  },
  {
    title: 'Rock Paper Scissors',
    url: 'https://rock-paper-scissors.koenvangilst.nl',
    slug: 'rock-paper-scissors'
  }
];

type LazyIframeProps = {
  url: string;
  title: string;
  index: number;
};

function LazyIframe({ url, title, index }: LazyIframeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        rootMargin: '100px', // Start loading a bit before it comes into view
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full snap-start snap-always bg-slate-900"
      id={`project-${index}`}
    >
      {isVisible && (
        <>
          {!hasLoaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900">
              <div className="text-center text-white">
                <Icon icon="spinner" className="mx-auto mb-4 h-8 w-8 animate-spin" />
                <p className="text-sm">Loading {title}...</p>
              </div>
            </div>
          )}
          <iframe
            src={url}
            title={title}
            className="h-full w-full border-0"
            loading="lazy"
            onLoad={() => setHasLoaded(true)}
          />
        </>
      )}
      {!isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white">
          <p className="text-sm">{title}</p>
        </div>
      )}

      {/* Project title overlay */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-6">
        <div className="pointer-events-auto flex justify-center">
          <Button
            as="a"
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            variant="outline"
            size="sm"
            className="group rounded-full border-white/20 bg-white/10 text-white shadow-lg shadow-black/20 backdrop-blur hover:border-white/40 hover:bg-white/20 focus:ring-white/50"
          >
            <span>Open in new tab</span>
            <Icon icon="external-link" className="h-4 w-4 text-white transition group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function GenerativeArtGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToProject = (index: number) => {
    const element = document.getElementById(`project-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const index = parseInt(id.split('-')[1]);
            setCurrentIndex(index);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5 // Trigger when 50% of the element is visible
      }
    );

    const projects = document.querySelectorAll('[id^="project-"]');
    projects.forEach((project) => observer.observe(project));

    return () => {
      projects.forEach((project) => observer.unobserve(project));
    };
  }, []);

  return (
    <div className="relative">
      <nav className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-3 py-2 backdrop-blur-sm sm:gap-2 sm:px-4">
        <BackButton
          fallbackHref="/lab"
          className="flex items-center gap-2 text-sm text-white transition-opacity hover:opacity-60"
        >
          <span className="hidden sm:inline">Back to Lab</span>
        </BackButton>
        <span className="hidden text-white sm:inline">|</span>
        <span className="text-xs text-white sm:text-sm">
          {currentIndex + 1} / {GENERATIVE_ART_PROJECTS.length}
        </span>
      </nav>

      <div className="fixed top-1/2 right-4 z-50 flex -translate-y-1/2 flex-col gap-2">
        {GENERATIVE_ART_PROJECTS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToProject(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              currentIndex === index ? 'scale-125 bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      <div ref={containerRef} className="h-screen snap-y snap-mandatory overflow-y-scroll">
        {GENERATIVE_ART_PROJECTS.map((project, index) => (
          <LazyIframe key={project.slug} url={project.url} title={project.title} index={index} />
        ))}
      </div>
    </div>
  );
}
