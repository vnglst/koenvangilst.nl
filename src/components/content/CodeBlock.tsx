import { useEffect, useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { Button } from '#/components/ui/Button';

export function CodeBlock({ children, ...props }: ComponentProps<'pre'>) {
  const code = useRef<HTMLPreElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState('Copy');
  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.current?.textContent ?? '');
      setStatus('Copied');
    } catch {
      setStatus('Copy failed');
    }
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus('Copy'), 2000);
  };

  return (
    <div className="code-block">
      <Button variant="bare" className="code-copy" aria-label="Copy code" onClick={() => void copy()}>
        <span aria-live="polite">{status}</span>
      </Button>
      <pre ref={code} {...props}>
        {children}
      </pre>
    </div>
  );
}
