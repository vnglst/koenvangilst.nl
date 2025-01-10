import { getClients, getPosts, getProjects, getSnippets } from 'cms/queries';

import { getPhotos } from './photography/getPhotos';

export default async function sitemap() {
  const allPosts = await getPosts();
  const allProjects = await getProjects();
  const allClients = await getClients();
  const allSnippets = await getSnippets();
  const photos = await getPhotos();

  const pages = [
    'about',
    'blog',
    'credits',
    'dashboard',
    'dashboard/stats',
    'labs',
    'portfolio',
    'snippets',
    'labs/prognosis-2100'
  ];

  const urls = [
    ...pages.map((page) => ({
      url: `https://koenvangilst.nl/${page}`
    })),
    ...allPosts.map((post) => ({
      url: `https://koenvangilst.nl/blog/${post.slug}`
    })),
    ...allProjects.map((project) => ({
      url: `https://koenvangilst.nl/projects/${project.slug}`
    })),
    ...allClients.map((client) => ({
      url: `https://koenvangilst.nl/clients/${client.slug}`
    })),
    ...allSnippets.map((snippet) => ({
      url: `https://koenvangilst.nl/snippets/${snippet.slug}`
    })),
    {
      url: `https://koenvangilst.nl/photography`,
      lastModified: new Date().toISOString()
    },
    ...photos.map((photo) => ({
      url: `https://koenvangilst.nl/photography/${photo.id}`,
      lastModified: photo.createdAt
    }))
  ];

  return urls.map((url) => ({
    ...url,
    lastModified: new Date().toISOString()
  }));
}
