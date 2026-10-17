import { useId } from 'react';
import type { ChangeEvent, PropsWithChildren } from 'react';

import { cx } from '#/lib/clsx';

interface ToggleProps {
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  className?: string;
}

export function Toggle({ label, onChange, checked, className, children }: PropsWithChildren<ToggleProps>) {
  const id = useId();
  return (
    <label htmlFor={id} className={cx('relative inline-flex cursor-pointer items-center', className)}>
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span aria-hidden="true" className="editorial-switch" />
      {label && <span className="ms-3 text-sm">{label}</span>}
      {children}
    </label>
  );
}
