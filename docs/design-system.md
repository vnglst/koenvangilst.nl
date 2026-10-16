# Familiar, refined design system

The approved direction evolves the original koenvangilst.nl identity: a portrait sidebar, navy and white canvases, wide bold page titles, readable sans serif text, and restrained blue accents. The interactive reference lives at `/design-system`, outside primary navigation and search indexing. The earlier exploration remains in `output/familiar-refined/`.

## Sources of truth

- `src/styles/tokens.css`: semantic colors, spacing, reading width, type roles, and viewer colors.
- `src/styles/fonts.css`: self-hosted Nimbus Sans Extended and IBM Plex Sans.
- `src/styles/colophon.css`: shared layout, components, responsive rules, and interaction states. The existing filename remains to avoid unnecessary import churn.
- `src/styles/prose.css`: article typography and mixed-media rhythm.
- `src/styles/design-system.css`: reference-page layout only.
- `src/components/`: reusable components, imported directly without barrel files.

## Principles

1. Keep the original character: the real portrait, Nimbus page titles, and blue active marker.
2. Use one consistent reading column for the homepage, Lab, talks, articles, photography, and art. Allow content to determine the page height.
3. Keep controls quiet, with explicit hover, keyboard focus, selected, and disabled states.
4. Preserve natural photo proportions in the overview and maximize the selected photograph without cropping.
5. Use actual writing, talks, photographs, and projects. Do not replace content with decorative labels.

## Theme

| Token       | Dark      | White     |
| ----------- | --------- | --------- |
| `--page`    | `#020617` | `#ffffff` |
| `--ink`     | `#e5e7eb` | `#111827` |
| `--muted`   | `#9ca3af` | `#4b5563` |
| `--line`    | `#1e293b` | `#d1d5db` |
| `--surface` | `#111827` | `#eef2f6` |
| `--accent`  | `#42a5f5` | `#1565c0` |

Dark is the default. The explicit choice persists in local storage and applies before hydration. Consume semantic tokens rather than adding theme branches to components. Blue identifies active navigation, selected filters, hover, and keyboard focus. Light mode uses darker slate secondary text and deeper blue accents. Interactive outlines use `--control-line` (`#7c8898` in light mode), separately from decorative dividers. Primary buttons use `--action` with white text: `#1565c0` in light mode and `#1976d2` in dark mode. Dark-mode colors are unchanged.

Photo detail keeps its neutral black canvas in both themes. Artwork and chart colors retain their own meaning.

## Typography

| Role                       | Typeface / weight          | Size / leading                                   |
| -------------------------- | -------------------------- | ------------------------------------------------ |
| Page title                 | Nimbus Sans Extended / 700 | 32px / 1.2; mobile 28px / 1.22; below 360px 25px |
| Section heading            | IBM Plex Sans / 600        | 22px / 1.4                                       |
| Archive or talk title      | IBM Plex Sans / 600        | 20px / 1.4; archive mobile 19px                  |
| Article and biography      | IBM Plex Sans / 400        | 17px / 28px                                      |
| Summary and description    | IBM Plex Sans / 400        | 16px / 24px                                      |
| Navigation and filters     | IBM Plex Sans / 400        | 14px; mobile navigation 15px                     |
| Metadata, captions, footer | IBM Plex Sans / 400        | 13–14px / 20–22px                                |
| Search and select          | IBM Plex Sans / 400        | 16px / 24px                                      |
| Code                       | System monospace           | 14px / 1.7                                       |

Page titles use balanced wrapping and slight negative tracking (`-0.01em`). Other headings use normal tracking. Text stays left aligned. Use regular weight for reading and semibold for structure; rich-text emphasis can use the locally served bold weight. Avoid shrinking captions below 13px.

The shared column has a 640px maximum. Article titles, metadata, body, and media use this same width. Article topics sit below the body in the article footer, using muted 13px links that wrap naturally. Lab listings omit entry counts. Body paragraphs have 24px after them; topic changes have 48px above and 16px below their headings. Media generally has 32px vertical spacing.

## Layout

Desktop uses a centered frame capped at 1000px, 40px side gutters, a 160px portrait rail, and a 64px gap. Content starts 112px from the top, increasing to 128px above 1700px. Between 768px and 1000px, use 32px gutters, a 132px rail, a 32px gap, and an 80px top margin.

Below 768px, the portrait, theme control, and menu form one header in document flow. The menu expands into two columns below them. Navigation closes after following a link. Use 24px page gutters, reduced to 20px below 360px. Footer content stays left aligned. There is no fixed bottom navigation.

All main screens share their content start and heading scale. The photo gallery uses the Colophon composition: two columns in a 1.4:1 ratio, 64px vertical and 40px horizontal gaps, and a 120px stagger on even items. Photos retain natural proportions with quiet captions. Below 768px, use one column with 48px gaps and no stagger. The fullscreen viewer hides the shell, contains the entire image, and overlays compact controls inside the viewport safe areas.

The art gallery places its native ten-project picker and Previous/Next controls above a 4:3 artwork frame; mobile uses a square frame. Project selection stays in the URL and supports reload/history. Gallery arrow keys do not intercept the embedded artwork's own controls. Time Flies uses the local fitted embed with its MIT license preserved.

## Components and behavior

Reuse `Container`, `Heading`, `Text`, `Prose`, `PageHeader`, `BackToLab`, `ArticleMetadata`, `ContentImage`, `CodeBlock`, `Button`, `TagLink`, `TagButton`, `GalleryNavigation`, and `Toolbar`. Extend existing primitives rather than creating parallel libraries.

- Main navigation: `aria-current`, blue text, and a desktop `>` marker. The marker is navigation feedback, not an extra logo.
- Filters: `aria-pressed`, blue text, and an underline. Lab category selection persists in URL parameter `q`; there is no search field.
- Archive links: underline only the title on hover. Dates and summaries remain unadorned.
- Back links: underline only the label; leave the arrow clear.
- Inline links: persistently underlined, blue on hover.
- Keyboard focus: a 2px blue outline, offset 4px. Navigation/control targets are at least 44px.
- Photo viewer: keyboard arrows, Escape, swipe, and disabled boundary controls.
- Code: scroll within its block and copy the complete command with announced feedback.
- Loading: keep the shell, reserve media dimensions, and delay skeletons roughly one second. Honor reduced motion.

Validate broad shared-layout changes against a production build with the Playwright regression suite, including narrow screens, both themes, client navigation, and layout shifts. Leave a running local preview with direct page links.
