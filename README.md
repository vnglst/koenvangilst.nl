# koenvangilst.nl

The source code of my personal website and blog. It's a fork of Lee Robinson excellent personal website (stripped down and with some styling changes). The source code of Lee's original can be found [here](https://github.com/leerob/leerob.io).

- **Framework**: [Next.js](https://nextjs.org/)
- **Deployment**: [Vercel](https://vercel.com)
- **Content**: [MDX](https://github.com/mdx-js/mdx)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Learn More

Lee Robinson recorded two live streams walking through his repository and answering questions. It's a introduction to Next and also the source of this website.

- [Stream #1 – Jan 27, 2021 (1h 11min)](https://www.youtube.com/watch?v=xXQsF0q8KUg)
- [Stream #2 – Nov 10, 2021 (1h 4min)](https://www.youtube.com/watch?v=WZZFW5xDjJ4)

## Overview

- `data/*` - MDX data that is used for blogs, newsletters, and code snippets.
- `layouts/*` - The different page layouts each MDX category (blog, newsletter, snippets) uses.
- `lib/*` - Short for "library", a collection of helpful utilities or code for external services.
- `pages/api/*` - [API routes](https://nextjs.org/docs/api-routes/introduction) powering [`/dashboard`](https://leerob.io/dashboard), newsletter subscription, guestbook, and post views.
- `pages/blog/*` - Static pre-rendered blog pages using MDX.
- `pages/dashboard` - [Personal dashboard](https://leerob.io/dashboard) tracking metrics.
- `pages/*` - All other static pages.
- `public/*` - Static assets including fonts and images.
- `scripts/*` - Two useful scripts to generate an RSS feed and a sitemap.
- `styles/*` - A small amount of global styles. I'm mostly using vanilla Tailwind CSS.

## Running Locally

Create a `.env` file similar to [`.env.example`]()).

```bash
$ git clone https://github.com/vnglst/koenvangilst.nl.git
$ cd koenvangilst.nl
$ yarn
$ yarn dev
```
