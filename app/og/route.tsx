import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const title = searchParams.get('title') || 'Koen van Gilst - Tech Lead';
    const description =
      searchParams.get('description') ||
      'Innovative tech lead from the Netherlands who likes to push the web beyond its limits.';
    const type = searchParams.get('type') || 'blog';

    return new ImageResponse(
      (
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
          {/* Top brand bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '8px',
                height: '40px',
                backgroundColor: '#199acc',
                borderRadius: '4px'
              }}
            />
            <span
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: '#199acc',
                letterSpacing: '-0.02em'
              }}
            >
              koenvangilst.nl
            </span>
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              maxWidth: '1000px'
            }}
          >
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
            <p
              style={{
                fontSize: 32,
                lineHeight: 1.4,
                color: '#666',
                margin: 0,
                fontWeight: 400
              }}
            >
              {description}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <span
              style={{
                fontSize: 24,
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              {type === 'tag' ? 'TAG' : 'BLOG POST'}
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630
      }
    );
  } catch (e) {
    console.error('Error generating OG image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
