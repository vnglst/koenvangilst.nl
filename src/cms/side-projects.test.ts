import { expect, test } from 'vitest';
import { getSideProjects } from './side-projects';

test('sorts article-backed and supplementary projects together, newest first', () => {
  const projects = getSideProjects([
    {
      title: 'Old project',
      summary: '',
      tags: ['side-project'],
      publishedAt: '2010-01-01',
      url: 'https://example.com/old'
    },
    {
      title: 'New project',
      summary: '',
      tags: ['side-project'],
      publishedAt: '2026-11-01',
      url: 'https://example.com/new'
    }
  ]);
  expect(projects[0].title).toBe('New project');
  expect(projects.at(-1)?.title).toBe('Old project');
  const dates = projects.map((project) => Date.parse(project.publishedAt));
  expect(dates.every(Number.isFinite)).toBe(true);
  expect(dates).toEqual([...dates].sort((a, b) => b - a));
  expect(projects.findIndex((project) => project.title === 'Caffeine')).toBeLessThan(
    projects.findIndex((project) => project.title === 'Tetris Time')
  );
});
