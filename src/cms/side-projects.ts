import { GENERATIVE_ART_PROJECTS } from '#/lib/generative-art-projects';

type ProjectPost = {
  title: string;
  projectTitle?: string;
  summary: string;
  tags: string[];
  url?: string;
  projectUrl?: string;
};

type SideProject = { title: string; summary: string; url: string };

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

const additionalProjects: SideProject[] = [
  ...GENERATIVE_ART_PROJECTS.map((project) => ({
    title: project.title,
    url: project.url,
    summary: artSummaries[project.slug] ?? 'An interactive generative art experiment.'
  })),
  {
    title: 'Caffeine',
    url: 'https://github.com/vnglst/Caffeine',
    summary: 'A small Mac menu bar app that keeps your computer awake.'
  },
  {
    title: 'Pomodori',
    url: 'https://github.com/vnglst/Pomodori',
    summary: 'A Mac menu bar timer for 25-minute focus sessions.'
  },
  {
    title: 'React Canvas',
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
        return url ? [{ title: post.projectTitle || post.title, summary: post.summary, url }] : [];
      }),
    ...additionalProjects
  ]) {
    const destination = new URL(project.url, 'https://koenvangilst.nl');
    const key = `${destination.origin}${destination.pathname.replace(/\/$/, '')}`;
    if (destinations.has(key)) continue;
    destinations.add(key);
    projects.push(project);
  }
  return projects;
}
