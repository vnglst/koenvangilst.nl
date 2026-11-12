import { GENERATIVE_ART_PROJECTS } from '#/lib/generative-art-projects';

type ProjectPost = {
  title: string;
  publishedAt: string;
  projectTitle?: string;
  summary: string;
  tags: string[];
  url?: string;
  projectUrl?: string;
};

type SideProject = { title: string; summary: string; url: string; publishedAt: string };

const artSummaries: Record<string, string> = {
  'voronoi-virus': 'A generative animation exploring Voronoi patterns.',
  'dancing-mosquitoes': 'A swarm of dancing particles.',
  'pong-wars': 'An endless game of Pong between two competing sides.',
  'purple-rain': 'A generative rain animation.',
  'particle-life': 'Emergent patterns from interacting particles.',
  'time-flies': 'A playful visualization of passing time.',
  aarde: 'An animated view of our planet.',
  'rock-paper-scissors': 'A simulation of rock, paper, scissors.'
};

// Repository creation dates for gallery projects without their own dated post.
const artDates: Record<string, string> = {
  'stacked-game-of-life': '2026-02-28',
  'tetris-time': '2025-12-30',
  'voronoi-virus': '2024-02-04',
  'dancing-mosquitoes': '2024-02-18',
  'pong-wars': '2024-01-27',
  'purple-rain': '2024-02-10',
  'particle-life': '2024-05-17',
  'time-flies': '2024-09-21',
  aarde: '2024-03-31',
  'rock-paper-scissors': '2024-02-11'
};

const additionalProjects: SideProject[] = [
  ...GENERATIVE_ART_PROJECTS.map((project) => ({
    title: project.title,
    url: project.url,
    publishedAt: artDates[project.slug],
    summary: artSummaries[project.slug] ?? 'An interactive generative art experiment.'
  })),
  {
    title: 'Caffeine',
    publishedAt: '2026-03-01',
    url: 'https://github.com/vnglst/Caffeine',
    summary: 'A small Mac menu bar app that keeps your computer awake.'
  },
  {
    title: 'Pomodori',
    publishedAt: '2026-03-01',
    url: 'https://github.com/vnglst/Pomodori',
    summary: 'A Mac menu bar timer for 25-minute focus sessions.'
  },
  {
    title: 'React Canvas',
    publishedAt: '2019-03-16',
    url: 'https://han-hooks.netlify.app/',
    summary: 'A drawing app built with React Hooks, with undo and local storage.'
  }
];

export function getSideProjects(posts: ProjectPost[]): SideProject[] {
  const projects: SideProject[] = [];
  const destinations = new Set<string>();
  for (const project of [
    ...posts
      .filter((post) => post.tags.includes('side-project'))
      .flatMap((post) => {
        const url = post.projectUrl || post.url;
        return url
          ? [{ title: post.projectTitle || post.title, summary: post.summary, publishedAt: post.publishedAt, url }]
          : [];
      }),
    ...additionalProjects
  ]) {
    const destination = new URL(project.url, 'https://koenvangilst.nl');
    const key = `${destination.origin}${destination.pathname.replace(/\/$/, '')}`;
    if (destinations.has(key)) continue;
    destinations.add(key);
    projects.push(project);
  }
  return projects.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}
