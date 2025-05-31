import { getPosts } from 'cms/mdx-parser';

import { getPhotos } from './photography/getPhotos';

export default async function sitemap() {
  const allPosts = await getPosts();
  const photos = await getPhotos();

  const pages = ['about', 'lab', 'dashboard', 'dashboard/stats'];

  const urls = [
    ...pages.map((page) => ({
      url: `https://koenvangilst.nl/${page}`
    })),
    ...allPosts.map((post) => ({
      url: `https://koenvangilst.nl/lab/${post.slug}`
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
