const leftItems = ['vibe coding', 'outsourcing understanding', 'shortcuts', 'cognitive decline', 'cognitive debt'];
const rightItems = [
  'agentic coding',
  '10x engineer',
  'human in the loop',
  'accountability',
  'holistic system understanding'
];

const columns = [
  { title: 'AI Coworker', items: leftItems },
  { title: 'AI + Human', items: rightItems }
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
        {columns.map(({ title, items }) => (
          <div key={title}>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 0.75rem 0'
              }}
            >
              {title}
            </div>
            {items.map((item) => (
              <div
                key={item}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  margin: '0.35rem 0'
                }}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
