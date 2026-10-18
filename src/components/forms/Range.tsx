import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

import { cx } from '#/lib/clsx';

type RangeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  hideLabel?: boolean;
};

export function Range({ label, hideLabel = false, id, className, ...props }: RangeProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cx('editorial-range', className)}>
      <label htmlFor={inputId} className={hideLabel ? 'sr-only' : 'editorial-form-label'}>
        {label}
      </label>
      <input {...props} id={inputId} type="range" />
    </div>
  );
}
