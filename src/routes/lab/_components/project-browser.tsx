import { Text } from '#/components/ui/Text';
import { Fragment } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { BlogPostLink } from '#/components/ui/PostLink';
import { TagButton } from '#/components/ui/Tag';
import { Button } from '#/components/ui/Button';

type Project = {
  title: string;
  summary: string;
  tags: string[];
  slug: string;
  publishedAt: string;
  url?: string;
};

type ProjectBrowserProps = {
  projects: Project[];
};

const FEATURED_TAGS = [
  { label: 'All', query: '' },
  { label: 'articles', query: 'article' },
  { label: 'side projects', query: 'side-project' },
  { label: 'snippets', query: 'snippet' }
];

export function ProjectBrowser({ projects }: ProjectBrowserProps) {
  const search = useSearch({ from: '/lab/' });
  const urlQuery = search.q ?? '';
  const filteredProjects = useFilteredProjects(projects, urlQuery);

  return (
    <section>
      <TagFilter currentQuery={urlQuery} tags={FEATURED_TAGS} />
      <ProjectsDisplay projects={filteredProjects} />
    </section>
  );
}

function useFilteredProjects(projects: Project[], query: string): Project[] {
  if (!query) return projects;
  const lowerQuery = query.toLowerCase();
  return projects.filter((project) => project.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)));
}

type TagFilterProps = {
  currentQuery: string;
  tags: Array<{ label: string; query: string }>;
};

function TagFilter({ currentQuery, tags }: TagFilterProps) {
  const navigate = useNavigate();
  const search = useSearch({ from: '/lab/' });

  const handleTagClick = (tag: { label: string; query: string }) => (e: React.MouseEvent) => {
    e.preventDefault();
    const isActive = currentQuery === tag.query;

    if (isActive) {
      void navigate({ to: '/lab', search: { ...search, q: undefined } });
    } else {
      void navigate({ to: '/lab', search: { ...search, q: tag.query } });
    }
  };

  return (
    <section className="lab-filters" aria-label="Filter the Lab">
      {tags.map((tag) => {
        const isActive = currentQuery === tag.query;

        return (
          <TagButton key={tag.label} onClick={handleTagClick(tag)} variant={isActive ? 'active' : 'default'}>
            {tag.label}
          </TagButton>
        );
      })}
    </section>
  );
}

type ProjectsDisplayProps = {
  projects: Project[];
};

function ProjectsDisplay({ projects }: ProjectsDisplayProps) {
  const navigate = useNavigate();
  if (projects.length === 0) {
    return (
      <div className="lab-empty" role="status">
        <Text className="mb-3">No matching entries</Text>
        <Text tone="muted" className="mb-4">
          Try another category or clear your filters.
        </Text>
        <Button variant="outline" onClick={() => void navigate({ to: '/lab', search: { q: undefined } })}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className="project-list">
      <ProjectList projects={projects} />
    </div>
  );
}

function ProjectList({ projects }: { projects: Project[] }) {
  const displayedYears = new Set<string>();

  return (
    <>
      {projects.map((project) => {
        const year = new Date(project.publishedAt).getFullYear().toString();
        const showYear = !displayedYears.has(year);

        if (showYear) {
          displayedYears.add(year);
        }

        return (
          <Fragment key={project.slug}>
            {showYear && <h2 className="archive-year">{year}</h2>}
            <BlogPostLink compact {...project} />
          </Fragment>
        );
      })}
    </>
  );
}
