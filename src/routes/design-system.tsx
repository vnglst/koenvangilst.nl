import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Container } from '#/components/layout/Container';
import { Heading } from '#/components/content/Heading';
import { Prose } from '#/components/content/Prose';
import { CodeBlock } from '#/components/content/CodeBlock';
import { Button } from '#/components/ui/Button';
import { TagButton } from '#/components/ui/Tag';
import { Note } from '#/components/content/Note';
import { ContentImage } from '#/components/content/ContentImage';
import { Text } from '#/components/ui/Text';
import { GalleryNavigation } from '#/components/ui/GalleryNavigation';
import { Toolbar } from '#/components/layout/Toolbar';
import { Link } from '#/components/ui/Link';
import { Toggle } from '#/components/forms/Toggle';
import '#/styles/design-system.css';

export const Route = createFileRoute('/design-system')({
  head: () => ({
    meta: [
      { title: 'Familiar, refined design system | Koen van Gilst' },
      { name: 'robots', content: 'noindex, follow' }
    ]
  }),
  component: DesignSystem
});

const palette = [
  ['page', 'Canvas', '#020617', '#ffffff'],
  ['ink', 'Text & headings', '#e5e7eb', '#111827'],
  ['muted', 'Secondary text', '#9ca3af', '#4b5563'],
  ['line', 'Hairline dividers', '#1e293b', '#d1d5db'],
  ['surface', 'Code & controls', '#111827', '#eef2f6'],
  ['accent', 'Selected navigation', '#42a5f5', '#1565c0'],
  ['control-line', 'Interactive borders', '#1e293b', '#7c8898']
];

function DesignSystem() {
  const [filter, setFilter] = useState('articles');
  const [checked, setChecked] = useState(false);
  const [specimenIndex, setSpecimenIndex] = useState(0);

  return (
    <Container footer={false}>
      <div className="design-system">
        <header>
          <p className="ds-caption">Koen van Gilst / Familiar, refined</p>
          <Heading>Quiet by design.</Heading>
          <p className="ds-lead">
            A personal space for writing, photography, and experiments. The content carries the personality. The
            interface gives it room.
          </p>
          <nav className="ds-index" aria-label="Design system sections">
            {['Foundations', 'Typography', 'Space', 'Components', 'Library', 'Layouts', 'Behavior'].map((label) => (
              <Link key={label} href={`#${label.toLowerCase()}`}>
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <section id="foundations" className="ds-section">
          <Heading level={2}>Foundations</Heading>
          <p>
            Navy, white, and the original blue. Use the theme control above to see every specimen in dark or light mode.
          </p>
          <div className="ds-palette">
            {palette.map(([token, role, dark, light]) => (
              <div className="ds-color" key={token}>
                <span className="ds-swatch" style={{ background: `var(--${token})` }} />
                <div>
                  <strong>{role}</strong>
                  <code>--{token}</code>
                  <span className="ds-dark-value">{dark}</span>
                  <span className="ds-light-value">{light}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="ds-caption">
            Blue identifies the author and where you are. Inline links stay the text color and use an underline.
            Photography and artwork keep their own colors.
          </p>
        </section>

        <section id="typography" className="ds-section">
          <Heading level={2}>Typography</Heading>
          <p>
            Nimbus Sans Extended gives page titles their original character. IBM Plex Sans keeps reading and navigation
            clear. Both are self-hosted.
          </p>
          <div className="ds-specimen">
            <p className="ds-caption">Page title / Nimbus Sans Extended bold / 32px desktop, 28px mobile</p>
            <p className="editorial-heading editorial-heading-1">Code Doesn’t Speak for Itself</p>
            <p className="ds-caption">Section title / IBM Plex Sans semibold / 22px</p>
            <p className="editorial-heading editorial-heading-2">Articles &amp; Experiments</p>
            <p className="ds-caption">Body / IBM Plex Sans / 17px, 28px leading</p>
            <Prose as="div">
              <p>I'm a software engineer with a philosophy degree and a lifelong passion for creating software.</p>
            </Prose>
            <p className="ds-caption">Navigation / 14px · Dates & captions / 13px</p>
          </div>
          <div className="blog-article ds-specimen">
            <Prose as="div" className="article-body">
              <h2>Writing with room for images</h2>
              <p>
                A readable text column gives the story a steady rhythm. Photographs and diagrams can use the full width
                when they need more space.
              </p>
              <ContentImage
                src="/static/images/frontmania-2026-tetris.jpg"
                alt="Koen speaking at Frontmania with Tetris projected behind him"
                width={2048}
                height={1413}
                label="Frontmania, October 2026. Images retain their natural proportions."
              />
              <h3>Back to the story</h3>
              <p>Headings, captions, and paragraphs share one rhythm, with more space around a change of subject.</p>
              <blockquote>
                <p>Let the content carry the personality.</p>
              </blockquote>
            </Prose>
          </div>
          <p>
            Regular body text, semibold supporting headings, left alignment, and a consistent reading measure. Archive
            titles use 20px on desktop and 19px on mobile; summaries use 16px.
          </p>
        </section>

        <section id="space" className="ds-section">
          <Heading level={2}>Space is structure</Heading>
          <p>
            A four-pixel rhythm, with optical exceptions for type. Group related controls closely; give changes of
            subject more room.
          </p>
          <div className="ds-spacing">
            {[8, 12, 16, 20, 24, 28, 32, 40, 48, 64].map((size) => (
              <div key={size}>
                <span>{size}px</span>
                <i style={{ width: size }} />
              </div>
            ))}
          </div>
          <dl className="ds-facts">
            <div>
              <dt>Mobile page gutter</dt>
              <dd>24px</dd>
            </div>
            <div>
              <dt>Navigation gap</dt>
              <dd>28px</dd>
            </div>
            <div>
              <dt>Minimum navigation target</dt>
              <dd>44px</dd>
            </div>
            <div>
              <dt>Reading column</dt>
              <dd>640px maximum</dd>
            </div>
            <div>
              <dt>Home biography</dt>
              <dd>640px maximum</dd>
            </div>
          </dl>
        </section>

        <section id="components" className="ds-section">
          <Heading level={2}>Components</Heading>
          <p>
            Use text first. Add a surface or border when a control needs more emphasis. Controls and code panels use a
            small radius; portraits remain circular.
          </p>
          <div className="ds-example">
            <p className="ds-caption">Links</p>
            <Link href="/lab/code-doesnt-speak-for-itself">Read Code Doesn’t Speak for Itself</Link>
          </div>
          <div className="ds-example">
            <p className="ds-caption">Filters / selected state is underlined</p>
            <div className="ds-controls">
              {['articles', 'experiments', 'snippets'].map((label) => (
                <TagButton
                  key={label}
                  variant={filter === label ? 'active' : 'default'}
                  onClick={() => setFilter(label)}
                >
                  {label}
                </TagButton>
              ))}
            </div>
          </div>
          <div className="ds-example">
            <p className="ds-caption">Actions / primary, secondary, outline, quiet, disabled</p>
            <div className="ds-controls">
              <Button as="a" href="/photography">
                View photographs
              </Button>
              <Button as="a" href="/lab" variant="secondary">
                Browse Lab
              </Button>
              <Button as="a" href="/lab/gen-art-gallery" variant="outline">
                Open gallery
              </Button>
              <Button as="a" href="/" variant="ghost">
                About Koen
              </Button>
              <Button disabled>Unavailable</Button>
            </div>
          </div>
          <div className="ds-example">
            <p className="ds-caption">Switch / live specimen</p>
            <Toggle
              label="Show implementation notes"
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
            />
            {checked && (
              <Note>
                Reuse the existing Toggle component. Its native checkbox provides keyboard behavior and an accessible
                label.
              </Note>
            )}
          </div>
          <div className="ds-example">
            <p className="ds-caption">Code / scroll within the block, copy as plain text</p>
            <Prose as="div">
              <CodeBlock>
                <code>{'color: var(--ink);\nbackground: var(--page);'}</code>
              </CodeBlock>
            </Prose>
          </div>
          <div className="ds-example">
            <p className="ds-caption">Notes</p>
            <Note>Keep supporting information quiet, legible, and close to the content it explains.</Note>
          </div>
        </section>

        <section id="library" className="ds-section">
          <Heading level={2}>Component library</Heading>
          <Text tone="muted">
            These are the same components used by the application. Import each directly from its documented file.
          </Text>
          <div className="ds-example">
            <Text size="caption" tone="muted">
              ContentImage / native dimensions, optional caption
            </Text>
            <ContentImage src="/avatar.jpg" alt="Koen van Gilst" width={40} height={40} className="home-portrait" />
          </div>
          <div className="ds-example">
            <Text size="caption" tone="muted">
              Toolbar & GalleryNavigation / shared by galleries
            </Text>
            <Toolbar>
              <Text size="small">Gallery item {specimenIndex + 1} of 3</Text>
            </Toolbar>
            <GalleryNavigation
              label="Library gallery example"
              previousLabel="Previous example"
              nextLabel="Next example"
              previousDisabled={specimenIndex === 0}
              nextDisabled={specimenIndex === 2}
              onPrevious={() => setSpecimenIndex(specimenIndex - 1)}
              onNext={() => setSpecimenIndex(specimenIndex + 1)}
            />
          </div>
          <Prose as="div">
            <CodeBlock>
              <code>{`import { Button } from '#/components/ui/Button';\nimport { Text } from '#/components/ui/Text';\nimport { Note } from '#/components/content/Note';\nimport { Container } from '#/components/layout/Container';\n\n<Container layout="reading">\n  <Text tone="muted">Supporting text</Text>\n  <Note>Useful context</Note>\n  <Button variant="outline">Continue</Button>\n</Container>`}</code>
            </CodeBlock>
          </Prose>
        </section>

        <section id="layouts" className="ds-section">
          <Heading level={2}>One signature, several rhythms</Heading>
          <dl className="ds-patterns">
            <div>
              <dt>
                <Link href="/">Introduction</Link>
              </dt>
              <dd>
                A 48px portrait above vertical navigation on desktop. The biography and visible name align with the same
                reading column as the inner pages.
              </dd>
            </div>
            <div>
              <dt>
                <Link href="/lab">Archive</Link>
              </dt>
              <dd>
                Text filters and year groups. Desktop pairs dates with semibold titles and summaries. Mobile stacks each
                entry into a single readable column.
              </dd>
            </div>
            <div>
              <dt>
                <Link href="/lab/code-doesnt-speak-for-itself">Reading</Link>
              </dt>
              <dd>
                A single 640px column, quiet metadata, and 17px text with 28px leading. Titles, body, and images share
                one left edge.
              </dd>
            </div>
            <div>
              <dt>
                <Link href="/photography">Photography</Link>
              </dt>
              <dd>
                Natural photo proportions in two unequal, staggered columns with quiet captions. One column on mobile.
                Open a photo for a full-viewport image, fitted without cropping, on black in both themes.
              </dd>
            </div>
            <div>
              <dt>
                <Link href="/lab/gen-art-gallery">Experiments</Link>
              </dt>
              <dd>
                The work is the main event. Consistent titles, compact controls, a native project picker, and space for
                the original interactive canvas.
              </dd>
            </div>
          </dl>
          <Note>
            Below 768px: 24px gutters and a portrait header with theme and menu controls. Navigation expands below the
            header. Footer content stays left aligned. Photo detail uses its own immersive layout.
          </Note>
        </section>

        <section id="behavior" className="ds-section">
          <Heading level={2}>Behavior &amp; care</Heading>
          <ul className="ds-rules">
            <li>Dark is the default. Light is an explicit choice that persists between visits.</li>
            <li>
              Keyboard focus uses a visible 2px outline, offset by 4px. Selected states also use semantic attributes.
            </li>
            <li>Use motion to answer an action. Honor reduced-motion preferences.</li>
            <li>
              Reserve image and chart dimensions. Keep the shell stable while content loads; delay loading indicators by
              about a second.
            </li>
            <li>
              Write in sentence case. Use real titles, captions, and content. Avoid decorative labels, gradients,
              shadows, and card grids.
            </li>
          </ul>
          <p className="ds-caption">
            This page uses the website’s shared components and theme tokens. Implementation guidance lives in
            docs/design-system.md.
          </p>
        </section>
      </div>
    </Container>
  );
}
