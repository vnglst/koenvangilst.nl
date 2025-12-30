# Claude Code Instructions

## About This Site

Personal website built with Next.js, self-hosted on Hetzner. Contains blog posts, data visualizations, and a generative art gallery. Follows a strict self-hosting and open-source philosophy.

## Content Security Policy (CSP)

When adding new projects to the generative art gallery, you **must** update the Content Security Policy to allow iframe embedding.

### Location

CSP headers are configured in: `/config/next-headers.js`

### Adding a New Project to the Gallery

1. Add the project to the `GENERATIVE_ART_PROJECTS` array in `/app/lab/gen-art-gallery/GenerativeArtGallery.tsx`
2. Add the project's domain to the `frame-src` directive in `/config/next-headers.js`

### Example

If adding `example-viz.koenvangilst.nl`:

```javascript
frame-src 'self' svelte.dev codesandbox.io example-viz.koenvangilst.nl ...;
```

### What Happens If You Forget

If you forget to add the domain to CSP, the browser will block the iframe with an error like:

```
Framing 'https://example-viz.koenvangilst.nl/' violates the following Content Security Policy directive: "frame-src ..."
```
