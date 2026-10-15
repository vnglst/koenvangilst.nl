# Colophon design system

The Quiet introduction B direction for koenvangilst.nl. A small personal signature beside writing, photography, and experiments. Minimalism is the governing constraint: use composition, typography, and space to establish hierarchy.

The live reference is at `/design-system`. It uses the same theme, components, fonts, and CSS as the website. Toggle the theme to inspect dark and light specimens. This reference is deliberately absent from the main navigation and search-engine indexing.

## Sources of truth

- `src/styles/tokens.css`: semantic color, spacing, measure, target-size, and photo-viewer tokens.
- `src/styles/colophon.css`: component styles, editorial layout, responsive rules, interaction states, and photography viewer.
- `src/styles/fonts.css`: self-hosted font declarations and `--font-sans`.
- `src/styles/design-system.css`: layout for the reference page only.
- `src/components/`: reusable implementations. Import components directly, without barrel files.
- `output/colophon/personal/selected-b/`: approved generated screen references, including the immersive photo viewer. Treat generated images as composition guidance; real content and working behavior take precedence.

When changing a design decision, update the shared CSS, this guide, and the visual reference together. Do not create a second set of theme values for individual pages.

## Principles

1. Content carries the personality. Use actual writing, photographs, and original projects.
2. Keep a quiet signature. The portrait belongs above the homepage biography; the desktop signature is typographic. There is no terminal symbol.
3. Leave space. A narrow column against a generous empty field is intentional. Do not fill that field with cards or decoration.
4. Give blue a purpose. It marks active primary navigation. Text filters currently use ink and an underline; preserve that distinction.
5. Adapt the composition. Mobile has its own reading rhythm and a consistent left-aligned bottom navigation.
6. Let images occupy space. Preserve natural proportions in the collection and maximize the selected photograph in its viewer.

## Color tokens

| CSS token   | Dark      | Light     | Purpose                                    |
| ----------- | --------- | --------- | ------------------------------------------ |
| `--page`    | `#111110` | `#f5f3ed` | Page canvas                                |
| `--ink`     | `#e9e7e0` | `#242420` | Headings, body, links, primary actions     |
| `--muted`   | `#a5a59b` | `#686860` | Secondary copy, dates, inactive navigation |
| `--line`    | `#363632` | `#d8d6cf` | Fine structural dividers                   |
| `--surface` | `#20201d` | `#eae8e1` | Code and secondary controls                |
| `--accent`  | `#6ca8d6` | `#256c9f` | Active primary navigation                  |

Dark is the default, regardless of the operating system preference. An explicit theme choice is stored in local storage and applied before hydration. Components inherit semantic tokens rather than branching on the theme.

Text and muted text against the page exceed WCAG AA normal-text contrast in both themes. Divider colors are structural only; they are not suitable as text or as the sole identifier of an interactive element. Underline body links and expose selected states with `aria-current` or `aria-pressed`.

Photo detail is intentionally theme-independent: canvas `#090909`, foreground `#f4f4f1`, secondary text `#c5c5be`, and control backgrounds `rgb(9 9 9 / 78%)`. Original artwork and data visualization colors need not be desaturated into the interface palette.

## Typography

| Role                              | Typeface                   | Size / leading                   |
| --------------------------------- | -------------------------- | -------------------------------- |
| Page title                        | Libre Caslon Text, regular | `clamp(30px, 3vw, 42px)` / 1.18  |
| Section title                     | Libre Caslon Text, regular | 27px / 1.18                      |
| Subheading, desktop archive title | Libre Caslon Text, regular | 23px; archive leading 1.4        |
| Desktop signature                 | Libre Caslon Text, regular | 29px / 1.25; 25px at 768–900px   |
| Prose                             | IBM Plex Sans              | 17px / 1.75 desktop; 1.65 mobile |
| Navigation, filters, metadata     | IBM Plex Sans              | 14px; date/caption 13px          |
| Code                              | Existing monospace stack   | 14px / 1.7                       |

Headings use slight negative tracking (`-0.025em`) and balanced wrapping. Body text is left aligned. Use regular weight as the baseline; bold only when the content needs emphasis. Both typefaces are locally served under open font licenses.

Below 768px: page titles are 29px, article titles 32px, archive page titles 25–29px. Compact archive rows switch to 17px IBM Plex Sans with 1.6 leading; other post titles remain 20px serif. Photo captions become 18px serif in the collection, while viewer captions remain 16px sans serif.

## Spacing and shape

Use a four-pixel rhythm for new spacing: 8, 12, 16, 20, 24, 28, 32, 40, 48, and 64px. This is guidance, not a mandate to replace existing optical adjustments.

- 8–12px: tightly related metadata and controls.
- 16–24px: internal groups, prose support, title separation.
- 28px: main navigation gap; 24px for archive filters.
- 40–64px: larger content breaks and photography spacing.
- 1px rules provide structure. Avoid decorative outlines, shadows, gradients, and rounded cards.
- Rectangular controls and code panels. Circular 40px portrait and rounded switches are explicit exceptions.

## Layout recipes

| Screen           | Desktop                                                                                    | Below 768px                                 |
| ---------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------- |
| Shared shell     | Shared frame, top 120px; content max 720px                                                 | Padding 100px 24px 110px                    |
| Homepage         | Shared left edge, top 160–240px; max 520px                                                 | Top `max(112px, 17svh)`; visible page title |
| Reading          | Shared left edge; max 720px                                                                | One readable column; 32px title             |
| Wide content     | Shared frame; max 1100px                                                                   | Same 24px gutters                           |
| Photo collection | Top 120px; columns 1.4:1; gap 64px vertically, 40px horizontally; even items stagger 120px | One column, 48px gaps, no stagger           |
| Art gallery      | Shared frame and page-title scale; canvas `min(60svh, 700px)`                              | 24px gutters; canvas 48svh                  |
| Land use         | Shared frame, top 120px; square black chart with reserved dimensions                       | 24px gutters; square chart                  |

At 768–900px, the shared shell moves to 34vw/4vw and navigation gaps tighten to 16px.

From 1100px, all editorial screens share a desktop frame capped at 1600px. Its outer gutter is `max(64px, calc((100vw - 1600px) / 2 + 64px))`. Navigation anchors to that gutter, with a 220–320px rail. Every content column begins at the gutter plus `clamp(280px, 26vw, 416px)`. Reading and archive columns stay at 720px maximum; the homepage stays at 520px; wide visual work uses the remaining frame width, up to 1100px. These measures preserve readable content while keeping the composition together on large monitors.

The desktop frame applies from 1100px. Between 901px and 1099px, compact desktop retains its proportional offsets (37vw standard, 31vw wide, 40vw art/map, 54vw home). All inner pages begin 120px from the top and use the same page-title scale. The homepage retains a quieter vertical entrance, capped at 240px (`clamp(160px, 22svh, 240px)`). Photo detail remains full viewport.

### Signature and navigation

Desktop colophon: fixed 54px from the bottom. From 1100px it aligns to the shared frame gutter and uses a 220–320px rail; compact desktop retains the existing 5vw/27vw proportions. Navigation sits 16px below the signature, with 44px-high links. The theme control stays in the upper right.

Mobile: hide the signature on every main screen. The fixed bottom bar uses the page background, 24px side gutters, and a 28px gap between left-aligned links. Include bottom safe-area padding. Reserve 110px below content so final rows remain reachable. The homepage still has a proper visible title.

### Immersive photography

Use the standalone `FullScreenGallery`, not the editorial Container. Fill `100dvh`, hide page scrolling, and use `object-fit: contain` without cropping or a constrained content column. Keep the black canvas in both themes. Back and the counter overlay the top; caption and previous/next controls overlay the bottom with safe-area offsets and legible translucent backgrounds. Support arrow keys, Escape, swipe, browser history, and direct URLs. Every control remains available in portrait and landscape orientations.

## Components and states

| Need               | Existing implementation         | Rule                                                                                           |
| ------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| Standard page      | `layout/Container`, `Sidebar`   | Use `home` or `wide` only for the relevant recipe                                              |
| Titles             | `content/Heading`               | Preserve heading hierarchy; class controls visual role                                         |
| Rich content       | `content/Prose`, `MDXComponent` | Text links underlined; code scrolls within its block                                           |
| Article metadata   | `content/ArticleMetadata`       | Muted date and reading time, quiet hierarchy                                                   |
| Archive entry      | `ui/PostLink`                   | Text-first layout; underline title on hover                                                    |
| Actions            | `ui/Button`                     | Primary ink fill; secondary surface fill; outline or ghost for quieter actions; sm/md/lg sizes |
| Topics and filters | `ui/Tag`                        | Plain text; active filter ink + underline and `aria-pressed`; no pill background               |
| Boolean control    | `forms/Toggle`                  | Native labeled checkbox; visible keyboard focus                                                |
| Theme              | `theme/ThemeToggleText`         | Clear accessible action label; persistent choice                                               |
| Code               | `content/CodeBlock`             | Copy button with Copied / Copy failed feedback; preserve plain text                            |
| Supporting note    | `.editorial-note`               | Muted text with a fine left rule                                                               |

Hover adds an underline or increases text contrast. Disabled buttons use reduced opacity and native `disabled`; do not rely on color alone. Keyboard focus uses a 2px muted outline offset 5px (blue in the photo viewer); switches have their own ink outline. Keep navigation and primary control targets at least 44px. The existing compact code-copy control is 40px high and at least 44px wide.

Do not invent a toast, modal, alert color, or new component family until an actual feature requires it. For unavailable content, say what is unavailable and offer a useful next action.

## Motion, loading, and accessibility

- Motion responds to user actions. Photo navigation is a 300ms directional transition when supported; switches use 120ms. Avoid decorative entrance sequences.
- Respect `prefers-reduced-motion`; the shared stylesheet reduces animations and transitions and removes smooth scrolling.
- Reserve image width/height and chart aspect ratios. Loading placeholders use the same shell and dimensions as final content. Delay indicators by about one second to avoid flashes on fast loads.
- Keep semantic landmarks, heading order, text alternatives, accessible control names, and the skip link.
- Check keyboard operation, 320px and 390px mobile widths, desktop, mobile landscape, both themes, long titles, and final-content visibility above the bottom bar.
- Run browser regression checks against a production build, per README. Leave a local preview running with links to changed screens.

## Extending the system

Start with an existing screen recipe and component. Use semantic tokens for interface colors. Put shared decisions in `colophon.css`, and keep feature-specific styling local. Add a specimen here when a reusable pattern is introduced. Verify the actual page with real content before treating a new pattern as part of the system.

## Component library API

The library lives in the existing `src/components` folders. It has no third-party UI runtime and no barrel exports. The live `/design-system` page renders these exact components.

| Import under `#/components/`            | API and usage                                                                                                                     | Applied in                                                            |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `layout/Container`                      | `layout="default\|reading\|photography\|art\|map"`; `home`, `wide`, `footer` control the established composition                  | Every editorial page; photo detail uses its dedicated viewport        |
| `layout/PageHeader`                     | `title`, optional children and className                                                                                          | Articles, Lab, topic archives                                         |
| `layout/Toolbar`                        | Native div props and children; wrapping, aligned controls                                                                         | Prognosis, library specimens                                          |
| `ui/Button`                             | Native button props; primary/secondary/outline/ghost; `variant="bare"` for composed controls; `as="a"` for action links; sm/md/lg | Every React button, including theme, code copy, filters and galleries |
| `ui/Link`                               | `href`, native anchor props; `variant="content\|plain"`; `externalIndicator` defaults true                                        | Prose, archive rows, homepage, footer, art links, reference           |
| `ui/Text`                               | `as` defaults p; `size="body\|small\|caption"`; `tone="ink\|muted"`; native props                                                 | Metadata, captions, empty states and gallery copy                     |
| `ui/Tag`                                | TagLink for topics; TagButton with default/active state                                                                           | Article topics, Lab filters, topic archives                           |
| `ui/GalleryNavigation`                  | Labels, previous/next callbacks and disabled states; `immersive` for photo controls                                               | Art gallery, fullscreen photo viewer, live specimen                   |
| `content/Heading`                       | Semantic `level` independent from optional visual `size` (1–6)                                                                    | Page headings, post entries, galleries and content                    |
| `content/Prose`                         | `as` and className; inherited editorial typesetting                                                                               | Articles, homepage biography, chart introduction                      |
| `content/ContentImage`                  | Native img props; optional `label` creates figure/caption; lazy by default                                                        | MDX images, homepage portrait, observed-AI gallery                    |
| `content/Note`                          | Native div props; fine rule and supporting text                                                                                   | MDX Disclaimer compatibility alias and reference                      |
| `content/LoadingState`                  | Native div props; role=status and delayed appearance                                                                              | Charts                                                                |
| `content/LoadingState` → `TextSkeleton` | Reserved article placeholder; no immediate flash                                                                                  | Suspended MDX content                                                 |
| `content/RecentArticles`                | Array of title/slug/publishedAt/url                                                                                               | Homepage                                                              |
| `content/CodeBlock`                     | Native pre props, children; copy with feedback                                                                                    | All MDX code and reference                                            |

`bare` buttons provide native semantics, a default type of button, disabled behavior, and shared focus styling. Their parent composition supplies dimensions and visual treatment. Do not use bare controls without a visible label or accessible name. Use `Button` variants for ordinary standalone actions.

`Link` forwards native attributes to internal and external links. External content links open in a new tab with an indicator by default; quiet footer and gallery links opt out of the indicator explicitly. Layout-specific presentation belongs to the composing component, not a new link implementation.

Article post titles use h3 below the archive year headings and retain their established visual size. Heading `size` allows this semantic order without tying appearance to the heading level. Original SVG illustrations, canvas artwork, D3 and ECharts rendering remain content, and use their own data-driven colors.

### Example

```tsx
import { Container } from '#/components/layout/Container';
import { PageHeader } from '#/components/layout/PageHeader';
import { Prose } from '#/components/content/Prose';
import { Note } from '#/components/content/Note';
import { Link } from '#/components/ui/Link';

<Container layout="reading">
  <PageHeader title="A real article title" />
  <Prose>
    <p>
      Write the content here, with a <Link href="/lab">link to the Lab</Link>.
    </p>
  </Prose>
  <Note>Supporting context belongs close to the content.</Note>
</Container>;
```

CSS tokens include `--space-2` through `--space-16` for the documented rhythm, `--mobile-gutter`, `--navigation-gap`, `--control-target`, `--reading-width`, and `--intro-width`. Immersive media uses `--viewer-page`, `--viewer-ink`, `--viewer-muted`, and `--viewer-overlay`. Reuse these names when composing new components.

Legacy cleanup: Container owns its main landmark and theme-control header directly. The single-use BackButton was replaced with the library Button on Prognosis; its browser-history fallback is preserved. MDX names such as Disclaimer and Image remain registered for published articles, without unused named exports.
