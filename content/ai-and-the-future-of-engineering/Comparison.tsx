const leftItems = ['vibe coding', 'outsourcing understanding', 'shortcuts', 'cognitive decline', 'cognitive debt'];
const rightItems = [
  'agentic coding',
  '10x engineer',
  'human in the loop',
  'accountability',
  'holistic system understanding'
];

export function Comparison() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem 0',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: '3rem',
          maxWidth: 500
        }}
      >
        <div>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 0.75rem 0'
            }}
          >
            AI Coworker
          </div>
          {leftItems.map((item) => (
            <div key={item} style={{ fontFamily: 'monospace', fontSize: '0.85rem', margin: '0.35rem 0' }}>
              {item}
            </div>
          ))}
        </div>
        <div>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 0.75rem 0'
            }}
          >
            AI + Human
          </div>
          {rightItems.map((item) => (
            <div key={item} style={{ fontFamily: 'monospace', fontSize: '0.85rem', margin: '0.35rem 0' }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
