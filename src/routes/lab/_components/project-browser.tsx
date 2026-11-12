import { Text } from '#/components/ui/Text';
import { Fragment } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { BlogPostLink } from '#/components/ui/PostLink';
import { Link } from '#/components/ui/Link';
import { TagButton } from '#/components/ui/Tag';
import { Button } from '#/components/ui/Button';

type Project = {
  title: string;
  summary: string;
  tags: string[];
  slug: string;
  publishedAt: string;
  url?: string;
  projectUrl?: string;
};

type ProjectBrowserProps = {
  projects: Project[];
};

export function ProjectBrowser({ projects }: ProjectBrowserProps) {
  const search = useSearch({ from: '/lab/' });
  const navigate = useNavigate();
  const query = search.q ?? '';
  const sideProjects = query === 'side-project';
  const articles = projects.filter((post) => post.tags.includes('article'));
  const filteredArticles =
    !query || query === 'article'
      ? articles
      : articles.filter((post) => post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())));

  return (
    <section>
      <nav className="lab-filters" aria-label="Browse the Lab">
        <TagButton
          variant={!sideProjects ? 'active' : 'default'}
          onClick={() => void navigate({ to: '/lab', search: { q: undefined } })}
        >
          All articles
        </TagButton>
        <TagButton
          variant={sideProjects ? 'active' : 'default'}
          onClick={() => void navigate({ to: '/lab', search: { q: 'side-project' } })}
        >
          Side projects
        </TagButton>
      </nav>
      {sideProjects ? (
        <>
          <Text tone="muted" className="mb-4">
            Apps, games, and experiments. Follow a link to explore a project.
          </Text>
          <ul className="side-project-list">
            {projects
              .filter((post) => post.tags.includes('side-project') && (post.projectUrl || post.url))
              .map((post) => (
                <li key={post.slug}>
                  <Link href={post.projectUrl || post.url!}>{post.title}</Link>
                  <Text tone="muted">{post.summary}</Text>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <>
          {query && query !== 'article' && <Text className="mb-4">Articles tagged “{query}”</Text>}
          <ProjectsDisplay projects={filteredArticles} />
        </>
      )}
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

  const displayedYears = new Set<string>();

  return (
    <div className="project-list">
      {projects.map((project) => {
        const year = new Date(project.publishedAt).getFullYear().toString();
        const showYear = !displayedYears.has(year);

        if (showYear) {
          displayedYears.add(year);
        }

        return (
          <Fragment key={project.slug}>
            {showYear && <h2 className="archive-year">{year}</h2>}
            <BlogPostLink {...project} />
          </Fragment>
        );
      })}
    </div>
  );
}
