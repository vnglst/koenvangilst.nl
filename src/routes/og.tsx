import { Resvg } from '@resvg/resvg-js';
import { createFileRoute } from '@tanstack/react-router';
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';

const FONT_PATH = path.join(process.cwd(), 'public/fonts/IBMPlexSans-Bold.ttf');

export const Route = createFileRoute('/og')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const title = url.searchParams.get('title') || 'Koen van Gilst - Tech Lead';
          const description =
            url.searchParams.get('description') ||
            'Innovative tech lead from the Netherlands who likes to push the web beyond its limits.';
          const type = url.searchParams.get('type') || 'blog';

          let fontData: Buffer;
          try {
            fontData = fs.readFileSync(FONT_PATH);
          } catch {
            return new Response(null, { status: 302, headers: { Location: '/banner.png' } });
          }

          const svg = await satori(
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                padding: '80px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{ width: '8px', height: '40px', backgroundColor: '#199acc', borderRadius: '4px' }}
                />
                <span style={{ fontSize: 32, fontWeight: 600, color: '#199acc', letterSpacing: '-0.02em' }}>
                  koenvangilst.nl
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
                <h1
                  style={{
                    fontSize: 72,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: '#1a1a1a',
                    margin: 0,
                    letterSpacing: '-0.03em'
                  }}
                >
                  {title}
                </h1>
                <p style={{ fontSize: 32, lineHeight: 1.4, color: '#666', margin: 0, fontWeight: 400 }}>
                  {description}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{ fontSize: 24, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                >
                  {type === 'tag' ? 'TAG' : 'BLOG POST'}
                </span>
              </div>
            </div>,
            {
              width: 1200,
              height: 630,
              fonts: [{ name: 'IBM Plex Sans', data: fontData, weight: 700, style: 'normal' }]
            }
          );

          const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
          const pngData = resvg.render().asPng();

          return new Response(Buffer.from(pngData), {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=86400, immutable'
            }
          });
        } catch (e) {
          console.error('OG image generation failed:', e);
          return new Response(null, { status: 302, headers: { Location: '/banner.png' } });
        }
      }
    }
  }
});
