import { Fragment } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { BlogPostLink } from '#/components/ui/PostLink';
import { TagButton } from '#/components/ui/Tag';

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
  { label: 'articles', query: 'article' },
  { label: 'side projects', query: 'side-project' },
  { label: 'snippets', query: 'snippet' },
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

  const regex = new RegExp(query, 'i');
  return projects.filter((project) => project.tags.some((tag) => regex.test(tag)));
}

type TagFilterProps = {
  currentQuery: string;
  tags: Array<{ label: string; query: string }>;
};

function TagFilter({ currentQuery, tags }: TagFilterProps) {
  const navigate = useNavigate();

  const handleTagClick = (tag: { label: string; query: string }) => (e: React.MouseEvent) => {
    e.preventDefault();
    const isActive = currentQuery === tag.query;

    if (isActive) {
      void navigate({ to: '/lab', search: { q: undefined } });
    } else {
      void navigate({ to: '/lab', search: { q: tag.query } });
    }
  };

  return (
    <section className="my-6 mb-12 flex flex-wrap justify-start gap-2">
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
  if (projects.length === 0) {
    return (
      <div className="mt-4 flex flex-col gap-6">
        <p className="mb-4 text-gray-600 dark:text-gray-400">Nothing found.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-6">
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
            <BlogPostLink showYear={showYear} {...project} />
          </Fragment>
        );
      })}
    </>
  );
}
