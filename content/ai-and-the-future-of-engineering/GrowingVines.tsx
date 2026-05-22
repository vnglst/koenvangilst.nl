import { useMemo } from 'react';

const LEAF_FILLS = ['#1a5c28', '#2e7d32', '#388e3c', '#52b768', '#7ec887', '#a5d6a7', '#c8e6c9'];

function makeRng(seed: number) {
  let s = (seed * 2654435761) >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0x100000000;
  };
}

function beanPath(bw: number, bh: number) {
  return (
    `M 0,${-bh}` +
    ` C ${bw * 0.5},${-bh} ${bw},${-bh * 0.8} ${bw},${-bh * 0.4}` +
    ` C ${bw * 1.1},0 ${bw},${bh * 0.4} ${bw * 0.6},${bh * 0.8}` +
    ` C ${bw * 0.3},${bh} 0,${bh} 0,${bh}` +
    ` C ${-bw * 0.3},${bh} ${-bw * 0.6},${bh * 0.8} ${-bw * 0.5},${bh * 0.3}` +
    ` C ${-bw * 0.9},0 ${-bw},${-bh * 0.35} ${-bw * 0.6},${-bh * 0.7}` +
    ` C ${-bw * 0.4},${-bh} 0,${-bh} 0,${-bh} Z`
  );
}

type Tendril = { d: string; sw: number; delay: number };
type Leaf = { cx: number; cy: number; rx: number; ry: number; rot: number; fill: string; delay: number };
type Bean = { cx: number; cy: number; bw: number; bh: number; rot: number; delay: number };
type Vine = {
  stemD: string;
  stemDelay: number;
  tendrils: Tendril[];
  leaves: Leaf[];
  beans: Bean[];
  endTime: number;
  x: number;
};

function buildVine(seed: number, x: number, topY: number, firstDir: number, offsetDelay: number): Vine {
  const rng = makeRng(seed);
  const r = (a: number, b: number) => a + rng() * (b - a);

  const leafFillByY = (y: number) => {
    const t = Math.max(0, Math.min(1, (1080 - y) / (1080 - topY)));
    const idx = Math.round(t * (LEAF_FILLS.length - 1));
    const jitter = Math.floor(rng() * 1.6);
    return LEAF_FILLS[Math.min(LEAF_FILLS.length - 1, idx + jitter)];
  };

  const wps: { x: number; y: number }[] = [];
  let wx = x;
  for (let y = 1080; y >= topY; y -= 44) {
    wx = Math.max(x - 30, Math.min(x + 30, wx + r(-12, 12)));
    wps.push({ x: Math.round(wx), y });
  }

  let stemD = `M ${wps[0].x},${wps[0].y}`;
  for (let i = 1; i < wps.length; i++) {
    const a = wps[i - 1],
      b = wps[i],
      my = (a.y + b.y) / 2;
    stemD +=
      ` C ${Math.round(a.x + r(-10, 10))},${Math.round(my + 14)}` +
      ` ${Math.round(b.x + r(-10, 10))},${Math.round(my - 14)}` +
      ` ${b.x},${b.y}`;
  }

  const tendrils: Tendril[] = [];
  const leaves: Leaf[] = [];
  const beans: Bean[] = [];
  let delay = offsetDelay + 0.3;
  let endTime = offsetDelay + 3.5;

  const addLeaf = (cx: number, cy: number, rx: number, ry: number, rot: number, fill: string, d: number) => {
    leaves.push({ cx: Math.round(cx), cy: Math.round(cy), rx, ry, rot, fill, delay: d });
    endTime = Math.max(endTime, d + 0.55);
  };

  for (let i = 1; i < wps.length - 1; i++) {
    const { x: wx, y: wy } = wps[i];
    delay += r(0.15, 0.28);

    for (const s of [1, -1]) {
      const big = rng() < 0.22;
      addLeaf(
        wx + s * r(4, big ? 22 : 16),
        wy + r(-10, 10),
        big ? r(24, 42) : r(8, 18),
        big ? r(11, 19) : r(4, 8),
        s * r(10, 42),
        leafFillByY(wy),
        delay - 0.05
      );
    }
    if (rng() < 0.6) {
      const big = rng() < 0.18;
      const s = rng() > 0.5 ? 1 : -1;
      addLeaf(
        wx + s * r(2, 14),
        wy + r(-18, 18),
        big ? r(20, 38) : r(6, 14),
        big ? r(9, 17) : r(3, 6),
        s * r(20, 50),
        leafFillByY(wy),
        delay + 0.1
      );
    }

    if (rng() < 0.95) {
      const dir = firstDir * (i % 2 === 0 ? 1 : -1);
      const len = r(55, 135);
      const ex = Math.round(wx + dir * len);
      const ey = Math.round(wy + r(-28, 12));
      const c1x = Math.round(wx + dir * len * 0.28 + r(-16, 16));
      const c1y = Math.round(wy + r(-22, -4));
      const c2x = Math.round(wx + dir * len * 0.68 + r(-10, 10));
      const c2y = Math.round(ey + r(-18, 5));
      const c = r(0.75, 1.5);

      const curlD =
        `C ${Math.round(ex + dir * c * 19)},${Math.round(ey - c * 14)}` +
        ` ${Math.round(ex + dir * c * 22)},${Math.round(ey + c * 7)}` +
        ` ${Math.round(ex + dir * c * 11)},${Math.round(ey + c * 17)}` +
        ` C ${Math.round(ex - dir * c * 1)},${Math.round(ey + c * 23)}` +
        ` ${Math.round(ex - dir * c * 10)},${Math.round(ey + c * 17)}` +
        ` ${Math.round(ex - dir * c * 7)},${Math.round(ey + c * 9)}`;

      tendrils.push({
        d: `M ${wx},${wy} C ${c1x},${c1y} ${c2x},${c2y} ${ex},${ey} ${curlD}`,
        sw: r(1.5, 2.7),
        delay
      });
      endTime = Math.max(endTime, delay + 0.9);

      const midY1 = wy + (ey - wy) * 0.4;
      const midY2 = wy + (ey - wy) * 0.75;
      addLeaf(
        wx + dir * len * 0.4 + r(-8, 8),
        midY1 + r(-6, 6),
        r(7, 14),
        r(3, 6.5),
        r(-35, 35),
        leafFillByY(midY1),
        delay + r(0.4, 0.7)
      );
      addLeaf(
        wx + dir * len * 0.75 + r(-8, 8),
        midY2 + r(-6, 6),
        r(7, 14),
        r(3, 6.5),
        r(-35, 35),
        leafFillByY(midY2),
        delay + r(0.6, 0.9)
      );

      const tipBig = rng() < 0.2;
      addLeaf(
        ex - dir * c * 7,
        ey + c * 9,
        tipBig ? r(18, 32) : r(7, 14),
        tipBig ? r(8, 14) : r(3.5, 6.5),
        r(-38, 38),
        leafFillByY(ey),
        delay + r(0.8, 1.2)
      );

      if (rng() < 0.5)
        addLeaf(
          ex - dir * c * 4 + r(-6, 6),
          ey + c * 14 + r(-6, 6),
          r(5, 10),
          r(2.5, 5),
          r(-40, 40),
          leafFillByY(ey),
          delay + r(0.9, 1.3)
        );

      if (rng() < 0.28) {
        const bd = delay + r(0.7, 1.1);
        beans.push({ cx: ex, cy: ey, bw: r(3, 5), bh: r(14, 24), rot: r(-180, 180), delay: bd });
        endTime = Math.max(endTime, bd + 0.65);
      }
    }
  }

  return { stemD, stemDelay: offsetDelay, tendrils, leaves, beans, endTime, x };
}

const VINE_CONFIGS = [
  { seed: 22, x: 1500, topY: 800, dir: -1 },
  { seed: 11, x: 270, topY: 820, dir: 1 },
  { seed: 91, x: 1660, topY: 250, dir: -1 },
  { seed: 28, x: 100, topY: 480, dir: 1 },
  { seed: 42, x: 160, topY: 260, dir: -1 },
  { seed: 55, x: 1760, topY: 210, dir: 1 },
  { seed: 17, x: 190, topY: 400, dir: -1 },
  { seed: 63, x: 1600, topY: 350, dir: 1 }
];

function buildAllVines() {
  const result: Vine[] = [];
  let offset = 0;
  for (const cfg of VINE_CONFIGS) {
    const vine = buildVine(cfg.seed, cfg.x, cfg.topY, cfg.dir, offset);
    result.push(vine);
    offset = vine.endTime + 0.4;
  }
  return result;
}

export function GrowingVines() {
  const vines = useMemo(buildAllVines, []);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="bn-main" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#8bc34a" />
            <stop offset="55%" stopColor="#558b2f" />
            <stop offset="100%" stopColor="#33691e" />
          </radialGradient>
        </defs>

        {vines.map((vine, vi) => (
          <g
            key={vi}
            className="vine-sway"
            style={{
              transformOrigin: `${vine.x}px 1080px`,
              animationDelay: `${vine.endTime}s`,
              animationDuration: `${7 + vi * 1.3}s`
            }}
          >
            <path
              className="vine-stem"
              d={vine.stemD}
              fill="none"
              stroke="#52b768"
              strokeWidth={4.5}
              strokeLinecap="round"
              style={{ animationDelay: `${vine.stemDelay}s` }}
            />

            {vine.tendrils.map((t, i) => (
              <path
                key={`t${i}`}
                className="vine-tendril"
                d={t.d}
                fill="none"
                stroke="#52b768"
                strokeWidth={t.sw}
                strokeLinecap="round"
                style={{ animationDelay: `${t.delay}s` }}
              />
            ))}

            {vine.leaves.map((l, i) => (
              <g key={`l${i}`} transform={`translate(${l.cx},${l.cy}) rotate(${l.rot})`}>
                <g className="vine-leaf" style={{ animationDelay: `${l.delay}s` }}>
                  <ellipse rx={l.rx} ry={l.ry} fill={l.fill} />
                </g>
              </g>
            ))}

            {vine.beans.map((b, i) => (
              <g key={`b${i}`} transform={`translate(${b.cx},${b.cy}) rotate(${b.rot})`}>
                <g className="vine-bean" style={{ animationDelay: `${b.delay}s` }}>
                  <path d={beanPath(b.bw, b.bh)} fill="url(#bn-main)" />
                  <path
                    d={`M 0,${-b.bh * 0.75} C ${b.bw * 0.22},${-b.bh * 0.2} ${b.bw * 0.1},${b.bh * 0.3} 0,${b.bh * 0.75}`}
                    fill="none"
                    stroke="#2d5a1b"
                    strokeWidth={b.bw * 0.18}
                    strokeOpacity={0.45}
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx={-b.bw * 0.2}
                    cy={-b.bh * 0.35}
                    rx={b.bw * 0.38}
                    ry={b.bh * 0.18}
                    fill="rgba(255,255,255,0.28)"
                  />
                  <circle cx={0} cy={-b.bh * 0.92} r={b.bw * 0.28} fill="#2d5a1b" />
                </g>
              </g>
            ))}
          </g>
        ))}
      </svg>

      {/* Title overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: 700,
            textTransform: 'uppercase',
            lineHeight: 1,
            margin: '0 0 0.75rem 0',
            letterSpacing: '-0.02em'
          }}
        >
          Growing a better world
        </h2>
        <p style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.25rem)', margin: '0 0 1.5rem 0' }}>together with AI</p>
        <p style={{ fontSize: 'clamp(0.7rem, 1vw, 0.9rem)', color: '#666666', margin: 0, fontFamily: 'monospace' }}>
          Koen van Gilst &middot; Tech Lead Rabobank
        </p>
      </div>

      <style>{`
        @keyframes vineSway {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(0.4deg); }
          50%  { transform: rotate(-0.6deg); }
          75%  { transform: rotate(0.3deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes growVine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes growTendril {
          to { stroke-dashoffset: 0; }
        }
        @keyframes leafPop {
          0%   { opacity: 0; transform: scale(0.05); }
          65%  { opacity: 1; transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes beanPop {
          0%   { opacity: 0; transform: scale(0); }
          65%  { opacity: 1; transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }
        .vine-sway {
          animation: vineSway 7s ease-in-out infinite;
        }
        .vine-stem {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: growVine 3.5s ease-out forwards;
        }
        .vine-tendril {
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
          animation: growTendril 1s ease-out forwards;
        }
        .vine-leaf {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: leafPop 0.5s ease-out forwards;
        }
        .vine-bean {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: beanPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
