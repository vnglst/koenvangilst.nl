import { BackToLab } from '#/components/layout/BackToLab';
import { useEffect, useState } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { Container } from '#/components/layout/Container';
import { Heading } from '#/components/content/Heading';
import { GalleryNavigation } from '#/components/ui/GalleryNavigation';
import { Link } from '#/components/ui/Link';

import { GENERATIVE_ART_PROJECTS } from '#/lib/generative-art-projects';

const route = getRouteApi('/lab/gen-art-gallery/');

export function GenerativeArtGallery() {
  const { project: selectedSlug } = route.useSearch();
  const navigate = route.useNavigate();
  const [loadedSlug, setLoadedSlug] = useState<string>();
  const currentIndex = Math.max(
    0,
    GENERATIVE_ART_PROJECTS.findIndex((item) => item.slug === selectedSlug)
  );
  const project = GENERATIVE_ART_PROJECTS[currentIndex];
  const loading = loadedSlug !== project.slug;

  useEffect(() => {
    // Third-party subresources can stall iframe load indefinitely.
    const timer = setTimeout(() => setLoadedSlug(project.slug), 8000);
    return () => clearTimeout(timer);
  }, [project.slug]);

  const selectProject = (index: number) => {
    if (index < 0 || index >= GENERATIVE_ART_PROJECTS.length || index === currentIndex) return;
    const next = GENERATIVE_ART_PROJECTS[index];
    setLoadedSlug(undefined);
    void navigate({ search: { project: next.slug }, resetScroll: false });
  };

  return (
    <Container wide footer={false} layout="art">
      <BackToLab />
      <Heading>Generative Art Gallery</Heading>
      <div
        className="art-toolbar"
        onKeyDown={(event) => {
          if (event.target instanceof HTMLSelectElement || event.altKey || event.ctrlKey || event.metaKey) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            selectProject(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
          }
        }}
      >
        <label className="art-project-picker">
          <span className="sr-only">Choose an art project</span>
          <select
            value={project.slug}
            onChange={(event) =>
              selectProject(GENERATIVE_ART_PROJECTS.findIndex((item) => item.slug === event.target.value))
            }
          >
            {GENERATIVE_ART_PROJECTS.map((item, index) => (
              <option value={item.slug} key={item.slug}>
                {index + 1}. {item.title}
              </option>
            ))}
          </select>
        </label>
        <GalleryNavigation
          label="Art projects"
          previousLabel="Previous art project"
          nextLabel="Next art project"
          previousDisabled={currentIndex === 0}
          nextDisabled={currentIndex === GENERATIVE_ART_PROJECTS.length - 1}
          onPrevious={() => selectProject(currentIndex - 1)}
          onNext={() => selectProject(currentIndex + 1)}
        />
      </div>
      <div className="art-stage" aria-busy={loading}>
        {loading && (
          <span className="art-loading" role="status">
            Loading artwork…
          </span>
        )}
        <iframe
          key={project.slug}
          src={project.url}
          title={project.title}
          className="art-viewport"
          onLoad={() => setLoadedSlug(project.slug)}
        />
      </div>
      <div className="art-caption">
        <div aria-live="polite" aria-atomic="true">
          <Heading level={2} className="sr-only">
            {project.title}
          </Heading>
          <span>
            {currentIndex + 1} / {GENERATIVE_ART_PROJECTS.length} projects
          </span>
        </div>
        <Link href={project.url} variant="plain" externalIndicator={false}>
          Open in new tab ↗
        </Link>
      </div>
    </Container>
  );
}
