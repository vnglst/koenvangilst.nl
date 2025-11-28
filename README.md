# koenvangilst.nl

The source code of my personal website and blog, built with modern web technologies.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with React Server Components and App Router
- **Content**: [MDX](https://github.com/mdx-js/mdx) with [mdx-bundler](https://github.com/kentcdodds/mdx-bundler)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design system
- **Analytics**: [Plausible](https://plausible.io/) (self-hosted) for privacy-friendly analytics
- **Code Highlighting**: [Rehype Prism Plus](https://github.com/timlrx/rehype-prism-plus)

## Project Structure

```
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── lab/               # Blog posts and projects showcase
│   ├── photography/       # Photography portfolio
│   ├── feed.xml/          # RSS feed generation
│   └── sitemap.ts         # Dynamic sitemap generation
├── cms/                   # Content Management System
│   ├── mdx-parser.ts      # MDX file parsing and processing
│   └── schema.ts          # Zod schemas for content validation
├── components/            # Reusable React components
│   ├── content/           # Content-specific components (MDX, articles)
│   ├── forms/             # Form components
│   ├── layout/            # Layout components (Container, etc.)
│   ├── theme/             # Theme and dark mode components
│   └── ui/                # UI primitives (buttons, links, etc.)
├── content/               # MDX blog posts and articles
│   ├── *.mdx             # Individual blog posts with frontmatter
├── lib/                   # Utility functions
│   ├── clsx.ts           # Tailwind class merging utility
│   ├── sluggify.ts       # URL slug generation
│   └── formatters.ts     # Date and text formatting
├── public/               # Static assets
└── styles/               # Global CSS styles
```

## Content Management

### MDX Processing Pipeline

1. **Content Discovery**: MDX files are read from the `/content` directory
2. **Frontmatter Parsing**: [gray-matter](https://github.com/jonschlinkert/gray-matter) extracts metadata
3. **Schema Validation**: Zod ensures content structure integrity with type safety
4. **MDX Compilation**: [mdx-bundler](https://github.com/kentcdodds/mdx-bundler) processes MDX with custom components
5. **Enhancement**: Rehype plugins add code highlighting, auto-linking headings, and more

### Content Schema

Each blog post includes structured frontmatter:

```yaml
---
title: 'Post Title'
publishedAt: '2024-01-01'
summary: 'Brief description for SEO and previews'
tags: ['article', 'technology']
image:
  src: '/static/images/post.jpg'
  alt: 'Image description'
  width: 1200
  height: 630
  showAsHeader: true
---
```

### Custom MDX Components

- **Images**: Optimized Next.js images with automatic sizing
- **Links**: Enhanced links with external link indicators
- **Code Blocks**: Syntax highlighted with copy functionality
- **Interactive Elements**: Custom React components for demos

## Features

- **Static Site Generation**: Pre-rendered pages for optimal performance
- **RSS Feed**: Automatically generated from blog posts
- **Sitemap**: Dynamic sitemap including all content
- **Photography Portfolio**: Image gallery with EXIF data
- **Dark Mode**: System-preference aware theme switching
- **Reading Time**: Calculated for each blog post
- **Tag System**: Categorized content with slug-based URLs
- **SEO Optimized**: Meta tags, Open Graph, and structured data

## Running Locally

Create a `.env` file similar to [`.env.example`]()).

```bash
$ git clone https://github.com/vnglst/koenvangilst.nl.git
$ cd koenvangilst.nl
$ npm install
$ npm run dev
```

Visit `http://localhost:3000` to see the site in development mode.

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## Docker Deployment

To build and run the application in Docker:

```bash
# Build the image with the current commit hash
docker build --build-arg SOURCE_COMMIT=$(git rev-parse HEAD) -t koenvangilst .

# Run the container
docker run -d -p 3000:3000 --name koenvangilst koenvangilst
```

The `SOURCE_COMMIT` build argument embeds the git commit hash into the application, which is displayed in the footer of the website.
