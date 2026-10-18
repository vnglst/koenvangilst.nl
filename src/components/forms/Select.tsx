import { useId } from 'react';
import type { SelectHTMLAttributes } from 'react';

import { cx } from '#/lib/clsx';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function Select({ label, id, className, children, ...props }: SelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cx('editorial-select', className)}>
      <label htmlFor={inputId} className="editorial-form-label">
        {label}
      </label>
      <select {...props} id={inputId}>
        {children}
      </select>
    </div>
  );
}
