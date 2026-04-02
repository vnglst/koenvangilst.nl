'use client';

export function RobotVsExoskeleton() {
  return (
    <div
      className="robot-vs-exo"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '2rem 0'
      }}
    >
      {/* AI Coworker */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ height: 220, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <svg viewBox="0 0 400 500" width={160} height={200} className="robot-float">
            {/* Shadow */}
            <ellipse cx={200} cy={475} rx={70} ry={6} fill="#1a1a1a" opacity={0.08} />

            {/* Head */}
            <rect x={145} y={40} width={110} height={80} rx={8} fill="#1a1a1a" />
            {/* Antenna */}
            <line x1={200} y1={40} x2={200} y2={18} stroke="#1a1a1a" strokeWidth={3} />
            <circle cx={200} cy={14} r={6} fill="#f5c4b5" stroke="#e8c8b8" strokeWidth={2} />
            {/* Eyes */}
            <circle cx={178} cy={75} r={12} fill="#f5c4b5" />
            <circle cx={178} cy={75} r={5} fill="#1a1a1a" />
            <circle cx={222} cy={75} r={12} fill="#f5c4b5" />
            <circle cx={222} cy={75} r={5} fill="#1a1a1a" />
            {/* Mouth */}
            <rect x={175} y={98} width={50} height={6} rx={3} fill="#666666" />
            <line x1={188} y1={98} x2={188} y2={104} stroke="#1a1a1a" strokeWidth={1} />
            <line x1={200} y1={98} x2={200} y2={104} stroke="#1a1a1a" strokeWidth={1} />
            <line x1={212} y1={98} x2={212} y2={104} stroke="#1a1a1a" strokeWidth={1} />

            {/* Neck */}
            <rect x={188} y={120} width={24} height={18} rx={4} fill="#666666" />

            {/* Torso */}
            <rect x={130} y={138} width={140} height={150} rx={8} fill="#1a1a1a" />
            {/* Chest panel */}
            <rect x={150} y={158} width={100} height={80} rx={4} fill="#333333" />
            {/* Reactor */}
            <circle cx={200} cy={198} r={22} fill="#333333" stroke="#666666" strokeWidth={2} />
            <circle cx={200} cy={198} r={14} fill="#f5c4b5" />
            <circle cx={200} cy={198} r={7} fill="#f5ccb5" />
            <circle cx={200} cy={198} r={3} fill="#1a1a1a" />
            {/* Side vents */}
            <rect x={136} y={170} width={8} height={40} rx={2} fill="#666666" />
            <rect x={256} y={170} width={8} height={40} rx={2} fill="#666666" />

            {/* Left arm */}
            <circle cx={118} cy={150} r={16} fill="#666666" stroke="#1a1a1a" strokeWidth={2} />
            <circle cx={118} cy={150} r={6} fill="#1a1a1a" />
            <rect x={106} y={168} width={24} height={80} rx={10} fill="#666666" />
            <circle cx={118} cy={252} r={10} fill="#1a1a1a" />
            <circle cx={118} cy={252} r={4} fill="#666666" />
            <rect x={108} y={264} width={20} height={70} rx={8} fill="#666666" />
            <rect x={104} y={336} width={28} height={24} rx={6} fill="#1a1a1a" />

            {/* Right arm */}
            <circle cx={282} cy={150} r={16} fill="#666666" stroke="#1a1a1a" strokeWidth={2} />
            <circle cx={282} cy={150} r={6} fill="#1a1a1a" />
            <rect x={270} y={168} width={24} height={80} rx={10} fill="#666666" />
            <circle cx={282} cy={252} r={10} fill="#1a1a1a" />
            <circle cx={282} cy={252} r={4} fill="#666666" />
            <rect x={272} y={264} width={20} height={70} rx={8} fill="#666666" />
            <rect x={268} y={336} width={28} height={24} rx={6} fill="#1a1a1a" />

            {/* Left leg */}
            <circle cx={168} cy={294} r={12} fill="#1a1a1a" />
            <circle cx={168} cy={294} r={5} fill="#666666" />
            <rect x={155} y={305} width={26} height={80} rx={10} fill="#666666" />
            <circle cx={168} cy={388} r={9} fill="#1a1a1a" />
            <circle cx={168} cy={388} r={4} fill="#666666" />
            <rect x={157} y={398} width={22} height={60} rx={8} fill="#666666" />
            <rect x={148} y={455} width={40} height={16} rx={4} fill="#1a1a1a" />

            {/* Right leg */}
            <circle cx={232} cy={294} r={12} fill="#1a1a1a" />
            <circle cx={232} cy={294} r={5} fill="#666666" />
            <rect x={219} y={305} width={26} height={80} rx={10} fill="#666666" />
            <circle cx={232} cy={388} r={9} fill="#1a1a1a" />
            <circle cx={232} cy={388} r={4} fill="#666666" />
            <rect x={221} y={398} width={22} height={60} rx={8} fill="#666666" />
            <rect x={212} y={455} width={40} height={16} rx={4} fill="#1a1a1a" />
          </svg>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, textAlign: 'center' }}>AI Coworker</h3>
      </div>

      {/* vs divider */}
      <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>vs</div>

      {/* Human + AI (Exoskeleton) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: 180,
            height: 220,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <div className="exo-glow" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 1000"
            width={160}
            height={210}
            className="exo-float exo-svg"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation={4} result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-big">
                <feGaussianBlur stdDeviation={8} result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="reactorGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#ffffff' }} />
                <stop offset="40%" style={{ stopColor: '#00e5ff' }} />
                <stop offset="100%" style={{ stopColor: '#006680' }} />
              </radialGradient>
            </defs>

            {/* Ground shadow */}
            <ellipse cx={400} cy={965} rx={200} ry={18} fill="#000" opacity={0.12} />

            {/* === EXOSKELETON (behind) === */}
            {/* Left exo leg */}
            <path
              d="M310,570 L290,650 L280,740 L260,740 L270,650 L285,570 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M355,570 L365,650 L370,740 L390,740 L380,650 L368,570 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M260,740 L250,840 L240,910 L220,910 L228,840 L235,740 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M390,740 L385,840 L380,910 L400,910 L400,840 L405,740 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <circle cx={325} cy={740} r={22} fill="#1e4a6e" stroke="#0f2b42" strokeWidth={3} />
            <circle cx={325} cy={740} r={12} fill="#ff9800" stroke="#e65100" strokeWidth={2} />
            <circle cx={325} cy={740} r={5} fill="#ffcc02" filter="url(#glow)" />
            <circle cx={335} cy={575} r={16} fill="#1e4a6e" stroke="#0f2b42" strokeWidth={3} />
            <circle cx={335} cy={575} r={8} fill="#ff9800" stroke="#e65100" strokeWidth={2} />
            <line
              x1={325}
              y1={595}
              x2={325}
              y2={725}
              stroke="#00e5ff"
              strokeWidth={3}
              className="pulse"
              strokeLinecap="round"
            />
            <line
              x1={310}
              y1={760}
              x2={300}
              y2={895}
              stroke="#00e5ff"
              strokeWidth={3}
              className="pulse"
              strokeLinecap="round"
            />
            {/* Left exo boot */}
            <path
              d="M210,900 L200,935 L190,955 L290,960 L300,940 L310,900 Z"
              fill="#1e4a6e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M190,955 L185,970 L295,975 L290,960 Z"
              fill="#153550"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <line
              x1={225}
              y1={915}
              x2={225}
              y2={952}
              stroke="#00e5ff"
              strokeWidth={2.5}
              className="pulse"
              strokeLinecap="round"
            />
            <line
              x1={275}
              y1={910}
              x2={275}
              y2={952}
              stroke="#00e5ff"
              strokeWidth={2.5}
              className="pulse"
              strokeLinecap="round"
            />
            <circle cx={250} cy={910} r={5} fill="#ff9800" filter="url(#glow)" />

            {/* Right exo leg */}
            <path
              d="M435,570 L420,650 L415,740 L395,740 L405,650 L415,570 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M490,570 L510,650 L520,740 L540,740 L530,650 L515,570 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M395,740 L400,840 L400,910 L380,910 L383,840 L378,740 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M540,740 L550,840 L560,910 L580,910 L572,840 L565,740 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <circle cx={470} cy={740} r={22} fill="#1e4a6e" stroke="#0f2b42" strokeWidth={3} />
            <circle cx={470} cy={740} r={12} fill="#ff9800" stroke="#e65100" strokeWidth={2} />
            <circle cx={470} cy={740} r={5} fill="#ffcc02" filter="url(#glow)" />
            <circle cx={465} cy={575} r={16} fill="#1e4a6e" stroke="#0f2b42" strokeWidth={3} />
            <circle cx={465} cy={575} r={8} fill="#ff9800" stroke="#e65100" strokeWidth={2} />
            <line
              x1={470}
              y1={595}
              x2={470}
              y2={725}
              stroke="#00e5ff"
              strokeWidth={3}
              className="pulse"
              strokeLinecap="round"
            />
            <line
              x1={490}
              y1={760}
              x2={500}
              y2={895}
              stroke="#00e5ff"
              strokeWidth={3}
              className="pulse"
              strokeLinecap="round"
            />
            {/* Right exo boot */}
            <path
              d="M490,900 L500,935 L510,955 L610,960 L600,940 L590,900 Z"
              fill="#1e4a6e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M510,955 L515,970 L615,975 L610,960 Z"
              fill="#153550"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <line
              x1={535}
              y1={915}
              x2={535}
              y2={952}
              stroke="#00e5ff"
              strokeWidth={2.5}
              className="pulse"
              strokeLinecap="round"
            />
            <line
              x1={575}
              y1={910}
              x2={575}
              y2={952}
              stroke="#00e5ff"
              strokeWidth={2.5}
              className="pulse"
              strokeLinecap="round"
            />
            <circle cx={555} cy={910} r={5} fill="#ff9800" filter="url(#glow)" />

            {/* Backpack / spine */}
            <rect x={365} y={310} width={70} height={270} rx={12} fill="#1e4a6e" stroke="#0f2b42" strokeWidth={3} />
            <rect x={378} y={325} width={44} height={6} rx={3} fill="#153550" stroke="#0a1f30" strokeWidth={1} />
            <rect x={378} y={340} width={44} height={6} rx={3} fill="#153550" stroke="#0a1f30" strokeWidth={1} />
            <rect x={378} y={355} width={44} height={6} rx={3} fill="#153550" stroke="#0a1f30" strokeWidth={1} />
            <line
              x1={400}
              y1={375}
              x2={400}
              y2={565}
              stroke="#00e5ff"
              strokeWidth={4}
              className="pulse-slow"
              strokeLinecap="round"
            />
            <circle cx={400} cy={400} r={6} fill="#ff9800" stroke="#e65100" strokeWidth={2} />
            <circle cx={400} cy={450} r={6} fill="#ff9800" stroke="#e65100" strokeWidth={2} />
            <circle cx={400} cy={500} r={6} fill="#ff9800" stroke="#e65100" strokeWidth={2} />
            <circle cx={400} cy={550} r={6} fill="#ff9800" stroke="#e65100" strokeWidth={2} />

            {/* Exo arms */}
            <path
              d="M275,340 L240,420 L220,480 L200,480 L215,410 L245,330 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M220,480 L195,570 L180,640 L155,640 L168,565 L190,480 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <circle cx={268} cy={340} r={20} fill="#1e4a6e" stroke="#0f2b42" strokeWidth={3} />
            <circle cx={268} cy={340} r={10} fill="#ff9800" stroke="#e65100" strokeWidth={2} />
            <circle cx={268} cy={340} r={4} fill="#ffcc02" filter="url(#glow)" />
            <circle cx={210} cy={482} r={16} fill="#1e4a6e" stroke="#0f2b42" strokeWidth={3} />
            <circle cx={210} cy={482} r={8} fill="#ff9800" stroke="#e65100" strokeWidth={2} />
            <line
              x1={258}
              y1={360}
              x2={218}
              y2={470}
              stroke="#00e5ff"
              strokeWidth={3}
              className="pulse"
              strokeLinecap="round"
            />
            <line
              x1={205}
              y1={498}
              x2={175}
              y2={630}
              stroke="#00e5ff"
              strokeWidth={3}
              className="pulse"
              strokeLinecap="round"
            />
            <path
              d="M150,625 L140,660 L140,690 L185,690 L190,660 L190,625 Z"
              fill="#1e4a6e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <circle cx={165} cy={650} r={6} fill="#ff9800" filter="url(#glow)" />

            <path
              d="M525,340 L560,420 L580,480 L600,480 L585,410 L555,330 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M580,480 L605,570 L620,640 L645,640 L632,565 L610,480 Z"
              fill="#1b3d5e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <circle cx={532} cy={340} r={20} fill="#1e4a6e" stroke="#0f2b42" strokeWidth={3} />
            <circle cx={532} cy={340} r={10} fill="#ff9800" stroke="#e65100" strokeWidth={2} />
            <circle cx={532} cy={340} r={4} fill="#ffcc02" filter="url(#glow)" />
            <circle cx={590} cy={482} r={16} fill="#1e4a6e" stroke="#0f2b42" strokeWidth={3} />
            <circle cx={590} cy={482} r={8} fill="#ff9800" stroke="#e65100" strokeWidth={2} />
            <line
              x1={542}
              y1={360}
              x2={582}
              y2={470}
              stroke="#00e5ff"
              strokeWidth={3}
              className="pulse"
              strokeLinecap="round"
            />
            <line
              x1={595}
              y1={498}
              x2={625}
              y2={630}
              stroke="#00e5ff"
              strokeWidth={3}
              className="pulse"
              strokeLinecap="round"
            />
            <path
              d="M610,625 L610,660 L615,690 L660,690 L660,660 L655,625 Z"
              fill="#1e4a6e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <circle cx={635} cy={650} r={6} fill="#ff9800" filter="url(#glow)" />

            {/* Shoulder bars */}
            <path d="M268,340 L365,325" fill="none" stroke="#1b3d5e" strokeWidth={12} strokeLinecap="round" />
            <path d="M532,340 L435,325" fill="none" stroke="#1b3d5e" strokeWidth={12} strokeLinecap="round" />

            {/* Hip belt */}
            <path
              d="M310,560 L490,560 L500,590 L300,590 Z"
              fill="#1e4a6e"
              stroke="#0f2b42"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <line
              x1={320}
              y1={575}
              x2={480}
              y2={575}
              stroke="#00e5ff"
              strokeWidth={2.5}
              className="pulse-slow"
              strokeLinecap="round"
            />

            {/* === HUMAN BODY === */}
            {/* Legs */}
            <path
              d="M355,560 L345,660 L340,760 L335,860 L385,860 L388,760 L390,660 L395,560 Z"
              fill="#4a6fa5"
              stroke="#2c4a7a"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M330,845 L325,890 L320,910 L395,910 L395,890 L390,845 Z"
              fill="#37474f"
              stroke="#263238"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M405,560 L410,660 L415,760 L420,860 L470,860 L465,760 L460,660 L450,560 Z"
              fill="#4a6fa5"
              stroke="#2c4a7a"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M415,845 L410,890 L405,910 L480,910 L480,890 L475,845 Z"
              fill="#37474f"
              stroke="#263238"
              strokeWidth={3}
              strokeLinejoin="round"
            />

            {/* Torso */}
            <path
              d="M340,320 C325,370 320,430 325,500 L330,560 L470,560 L475,500 C480,430 475,370 460,320 Z"
              fill="#5c8cc7"
              stroke="#3a6baa"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path d="M370,320 L400,345 L430,320" fill="none" stroke="#3a6baa" strokeWidth={2.5} />
            <rect x={420} y={400} width={30} height={25} rx={3} fill="none" stroke="#3a6baa" strokeWidth={2} />
            <line x1={432} y1={395} x2={432} y2={410} stroke="#ff9800" strokeWidth={3} strokeLinecap="round" />

            {/* Arms */}
            <path
              d="M330,330 L300,400 L280,470 L310,480 L325,420 L345,350"
              fill="#5c8cc7"
              stroke="#3a6baa"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M280,470 L260,550 L245,620 L275,630 L288,560 L310,480"
              fill="#5c8cc7"
              stroke="#3a6baa"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M240,615 C230,640 235,660 250,668 C265,672 278,660 280,640 L275,630 L245,620 Z"
              fill="#d4a574"
              stroke="#b8886a"
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            <path
              d="M255,625 C248,618 238,620 238,630"
              fill="none"
              stroke="#b8886a"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <path
              d="M470,330 L500,400 L520,470 L490,480 L475,420 L455,350"
              fill="#5c8cc7"
              stroke="#3a6baa"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M520,470 L540,550 L555,620 L525,630 L512,560 L490,480"
              fill="#5c8cc7"
              stroke="#3a6baa"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path
              d="M560,615 C570,640 565,660 550,668 C535,672 522,660 520,640 L525,630 L555,620 Z"
              fill="#d4a574"
              stroke="#b8886a"
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            <path
              d="M545,625 C552,618 562,620 562,630"
              fill="none"
              stroke="#b8886a"
              strokeWidth={2.5}
              strokeLinecap="round"
            />

            {/* Chest reactor */}
            <circle cx={400} cy={430} r={30} fill="#0d3347" stroke="#0f2b42" strokeWidth={3} />
            <circle
              cx={400}
              cy={430}
              r={22}
              fill="url(#reactorGrad)"
              filter="url(#glow-big)"
              className="reactor-beat"
            />
            <circle cx={400} cy={430} r={10} fill="#fff" opacity={0.95} />
            <circle
              cx={400}
              cy={430}
              r={26}
              fill="none"
              stroke="#00e5ff"
              strokeWidth={2}
              opacity={0.7}
              className="pulse"
            />
            <line x1={400} y1={405} x2={400} y2={398} stroke="#00e5ff" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={400} y1={455} x2={400} y2={462} stroke="#00e5ff" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={375} y1={430} x2={368} y2={430} stroke="#00e5ff" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={425} y1={430} x2={432} y2={430} stroke="#00e5ff" strokeWidth={2.5} strokeLinecap="round" />

            {/* Neck */}
            <rect x={382} y={280} width={36} height={45} rx={10} fill="#d4a574" stroke="#b8886a" strokeWidth={2.5} />

            {/* Head */}
            <ellipse cx={400} cy={225} rx={58} ry={68} fill="#d4a574" stroke="#b8886a" strokeWidth={2.5} />
            <path
              d="M342,215 C342,165 365,142 400,138 C435,142 458,165 458,215 L458,195 C458,155 440,130 400,125 C360,130 342,155 342,195 Z"
              fill="#4e342e"
              stroke="#3e2723"
              strokeWidth={2}
            />
            <path d="M360,165 C370,150 390,142 400,140 C385,145 368,158 360,175 Z" fill="#6d4c41" opacity={0.6} />
            {/* Eyes */}
            <ellipse cx={378} cy={225} rx={14} ry={16} fill="#fff" stroke="#263238" strokeWidth={2.5} />
            <ellipse cx={422} cy={225} rx={14} ry={16} fill="#fff" stroke="#263238" strokeWidth={2.5} />
            <circle cx={381} cy={227} r={8} fill="#4a6fa5" />
            <circle cx={425} cy={227} r={8} fill="#4a6fa5" />
            <circle cx={383} cy={226} r={4} fill="#1a237e" />
            <circle cx={427} cy={226} r={4} fill="#1a237e" />
            <circle cx={386} cy={222} r={3} fill="#fff" />
            <circle cx={430} cy={222} r={3} fill="#fff" />
            {/* Eyebrows */}
            <path d="M362,205 Q378,198 394,205" fill="none" stroke="#3e2723" strokeWidth={3.5} strokeLinecap="round" />
            <path d="M406,205 Q422,198 438,205" fill="none" stroke="#3e2723" strokeWidth={3.5} strokeLinecap="round" />
            {/* Nose */}
            <path
              d="M400,238 L395,255 L405,255"
              fill="none"
              stroke="#b8886a"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Mouth */}
            <path d="M382,268 Q400,282 418,268" fill="none" stroke="#6d4c41" strokeWidth={3} strokeLinecap="round" />
            <path d="M385,270 Q400,278 415,270" fill="#fff" stroke="none" opacity={0.5} />
            {/* Ears */}
            <ellipse cx={342} cy={230} rx={8} ry={14} fill="#d4a574" stroke="#b8886a" strokeWidth={2} />
            <ellipse cx={458} cy={230} rx={8} ry={14} fill="#d4a574" stroke="#b8886a" strokeWidth={2} />

            {/* Visor / HUD */}
            <path
              d="M338,215 L345,207 L455,207 L462,215 L462,237 L455,243 L345,243 L338,237 Z"
              fill="#00e5ff"
              fillOpacity={0.2}
              stroke="#00e5ff"
              strokeWidth={2.5}
            />
            <rect
              x={350}
              y={212}
              width={22}
              height={10}
              rx={2}
              fill="none"
              stroke="#00e5ff"
              strokeWidth={1.5}
              opacity={0.6}
              className="pulse"
            />
            <line
              x1={354}
              y1={216}
              x2={366}
              y2={216}
              stroke="#00e5ff"
              strokeWidth={1.2}
              opacity={0.6}
              className="pulse"
            />
            <line
              x1={354}
              y1={219}
              x2={360}
              y2={219}
              stroke="#00e5ff"
              strokeWidth={1.2}
              opacity={0.6}
              className="pulse"
            />
            <rect
              x={430}
              y={212}
              width={22}
              height={10}
              rx={2}
              fill="none"
              stroke="#00e5ff"
              strokeWidth={1.5}
              opacity={0.6}
              className="pulse"
            />
            <circle
              cx={441}
              cy={217}
              r={3}
              fill="none"
              stroke="#00e5ff"
              strokeWidth={1}
              opacity={0.6}
              className="pulse"
            />
            <circle cx={335} cy={225} r={6} fill="#ff9800" stroke="#e65100" strokeWidth={2} filter="url(#glow)" />
            <circle cx={465} cy={225} r={6} fill="#ff9800" stroke="#e65100" strokeWidth={2} filter="url(#glow)" />

            {/* Energy particles */}
            <circle cx={250} cy={380} r={3} fill="#00e5ff" opacity={0.6} className="pulse" filter="url(#glow)" />
            <circle cx={555} cy={330} r={2.5} fill="#00e5ff" opacity={0.5} className="pulse-slow" filter="url(#glow)" />
            <circle cx={220} cy={550} r={2} fill="#00e5ff" opacity={0.4} className="pulse" />
            <circle cx={580} cy={580} r={3} fill="#00e5ff" opacity={0.5} className="pulse-slow" filter="url(#glow)" />
            <circle cx={280} cy={700} r={2.5} fill="#00e5ff" opacity={0.4} className="pulse" filter="url(#glow)" />
            <circle cx={530} cy={720} r={2} fill="#00e5ff" opacity={0.35} className="pulse-slow" />
          </svg>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, textAlign: 'center' }}>AI + Human</h3>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes reactor-glow {
          0%, 100% { r: 20; }
          50% { r: 24; }
        }
        @keyframes exo-glow-pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }
        .robot-float { animation: float 4s ease-in-out infinite; }
        .exo-float { animation: float 4s ease-in-out infinite 0.5s; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        .pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .reactor-beat { animation: reactor-glow 1.5s ease-in-out infinite; }
        @media (max-width: 500px) {
          .robot-vs-exo {
            transform: scale(0.7);
            transform-origin: top center;
            margin-bottom: -30%;
          }
          .exo-svg {
            margin-top: -20px;
          }
        }
        .exo-glow {
          position: absolute;
          width: 160px;
          height: 160px;
          background: radial-gradient(circle, rgba(72, 187, 120, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: exo-glow-pulse 4s ease-in-out infinite;
          z-index: 0;
        }
      `}</style>
    </div>
  );
}
