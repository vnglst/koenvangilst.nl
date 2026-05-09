# koenvangilst.nl

The source code of my personal website and blog.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with [TanStack Router](https://tanstack.com/router) (file-based routing)
- **Runtime**: [React 19](https://react.dev/) with server functions via Vite
- **Content**: [MDX](https://github.com/mdx-js/mdx) with [@mdx-js/rollup](https://mdxjs.com/packages/rollup/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom design system
- **Analytics**: [Plausible](https://plausible.io/) (self-hosted) for privacy-friendly analytics
- **Code Highlighting**: [Rehype Prism Plus](https://github.com/timlrx/rehype-prism-plus)
- **Testing**: [Vitest](https://vitest.dev/)

## Project Structure

```
├── src/
│   ├── routes/             # TanStack Router file-based routes
│   │   ├── __root.tsx     # Root layout with fonts and metadata
│   │   ├── index.tsx      # Homepage
│   │   ├── about.tsx      # About page
│   │   ├── lab/           # Blog posts and projects showcase
│   │   ├── photography/   # Photography portfolio
│   │   ├── feed[.]xml.ts  # RSS feed generation
│   │   └── sitemap[.]xml.ts # Dynamic sitemap generation
│   ├── cms/               # Content Management System
│   │   ├── mdx-parser.ts  # MDX file parsing and processing
│   │   └── schema.ts      # Zod schemas for content validation
│   ├── components/        # Reusable React components
│   │   ├── content/       # Content-specific components (MDX, articles)
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components (Container, etc.)
│   │   ├── theme/         # Theme and dark mode components
│   │   └── ui/            # UI primitives (buttons, links, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── services/          # External service integrations
│   └── styles/            # Global CSS styles
├── content/               # MDX blog posts and articles
│   └── *.mdx             # Individual blog posts with frontmatter
├── public/                # Static assets
└── scripts/               # Build and deployment scripts
```

## Content Management

### MDX Processing Pipeline

1. **Content Discovery**: MDX files are read from the `/content` directory
2. **Frontmatter Parsing**: [gray-matter](https://github.com/jonschlinkert/gray-matter) extracts metadata
3. **Schema Validation**: Zod ensures content structure integrity with type safety
4. **MDX Compilation**: [@mdx-js/rollup](https://mdxjs.com/packages/rollup/) processes MDX with custom components
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

- **Images**: Responsive images with automatic sizing
- **Links**: Enhanced links with external link indicators
- **Code Blocks**: Syntax highlighted with copy functionality
- **Interactive Elements**: Custom React components for demos

## Features

- **Server-Side Rendering**: Full SSR via TanStack Start for optimal performance
- **RSS Feed**: Automatically generated from blog posts
- **Sitemap**: Dynamic sitemap including all content
- **Photography Portfolio**: Image gallery with EXIF data and optimized responsive images
- **Dark Mode**: System-preference aware theme switching
- **Reading Time**: Calculated for each blog post
- **Tag System**: Categorized content with slug-based URLs
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **LLM Honeypot**: Tracks when AI models access site content via `/llm-context`

## Running Locally

```bash
git clone https://github.com/vnglst/koenvangilst.nl.git
cd koenvangilst.nl
npm install
npm run dev
```

Visit `http://localhost:3000` to see the site in development mode.

## Development Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest tests
- `npm run format` - Format with Prettier and auto-fix lint
- `npm run check` - Check formatting with Prettier

## Docker Deployment

The app is self-hosted on Hetzner Cloud via [Coolify](https://coolify.io/). To build and run locally with Docker:

```bash
# Build the image with the current commit hash
docker build --build-arg SOURCE_COMMIT=$(git rev-parse HEAD) -t koenvangilst .

# Run the container
docker run -d -p 3000:3000 --name koenvangilst koenvangilst
```

The `SOURCE_COMMIT` build argument embeds the git commit hash into the application, displayed in the footer.

After the container starts, responsive images are generated automatically via `scripts/generate-images.mjs`.
