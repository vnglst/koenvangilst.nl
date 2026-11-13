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

// Summaries verified against each project's own README, page metadata, or implementation.
// Keep these grounded in the linked sources when editing.
const artSummaries: Record<string, string> = {
  // content/stacked-game-of-life.mdx
  'stacked-game-of-life':
    "A 3D visualization of Conway's Game of Life where dead cells sink into a glowing history stack.",
  // content/tetris-time.mdx
  'tetris-time':
    'A countdown and clock visualized with falling Tetris blocks. Each minute is built from falling tetrominoes using Tetris game mechanics.',
  // https://github.com/vnglst/vonoroi-virus/blob/main/README.md
  'voronoi-virus':
    'An animated Voronoi diagram built with D3 and canvas. A moving point continually reshapes the surrounding cells, creating a shifting geometric pattern.',
  // https://github.com/vnglst/dancing-mosquitoes/blob/main/index.html
  'dancing-mosquitoes':
    'A flocking simulation of mosquitoes dancing against a sunset. Each follows simple rules for alignment, cohesion, and separation, creating coordinated movement across the canvas.',
  // https://github.com/vnglst/pong-wars/blob/main/index.html
  'pong-wars':
    'An endless battle between day and night, played out by two bouncing balls. Each ball changes the color of the squares it hits, gradually claiming territory for its side.',
  // https://github.com/vnglst/purple-rain/blob/main/index.html
  'purple-rain':
    'A colorful animation of falling raindrops, built with JavaScript and canvas. The drops fall at different speeds and drift with a changing wind.',
  // https://github.com/vnglst/particle-life/blob/main/index.html
  'particle-life':
    'A recreation of Jeffrey Ventrella’s Particle Life, where interactions between colored particles produce shifting patterns. Randomize the interactions to explore different behaviors, and share a configuration through its URL.',
  // https://github.com/vnglst/time-flies/blob/main/index.html
  'time-flies':
    'A clock made from a swarm of animated flies that gather to form the current time. Click or touch the canvas to scatter them, then watch them find their way back into the digits.',
  aarde:
    'An artificial life simulation inspired by Tierra, exploring evolution through small programs running in shared memory. Watch the instructions execute and adjust the speed to follow the simulation.',
  // https://github.com/vnglst/rock-paper-scissors/blob/main/index.html
  'rock-paper-scissors':
    'A cellular automaton based on rock, paper, scissors, with colored cells competing across a grid. Each state can overtake one rival and lose to another, creating an evolving pattern of territories.'
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
    summary: artSummaries[project.slug]
  })),
  {
    // content/software-for-one.mdx
    title: 'Caffeine',
    publishedAt: '2026-03-01',
    url: 'https://github.com/vnglst/Caffeine',
    summary:
      'A small Mac menu bar app that prevents your computer from going to sleep. Built for presentations and long-running coding sessions, with the source available to build it yourself.'
  },
  {
    // content/software-for-one.mdx
    title: 'Pomodori',
    publishedAt: '2026-03-01',
    url: 'https://github.com/vnglst/Pomodori',
    summary:
      'A Mac menu bar app for timed focus sessions. A tomato icon counts down 25 minutes and plays a sound when the session ends, keeping the timer close without taking up a window.'
  },
  {
    // content/react-hooks-with-canvas.mdx
    title: 'React Canvas',
    publishedAt: '2019-03-16',
    url: 'https://han-hooks.netlify.app/',
    summary:
      'A canvas drawing app built with React Hooks. Draw in the browser, undo strokes, or clear the canvas, with your drawing saved locally between visits.'
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
