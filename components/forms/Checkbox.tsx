import React, { ChangeEvent, PropsWithChildren } from 'react';

import { cx } from 'lib/clsx';

interface CheckboxProps {
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  className?: string;
  color?: 'blue' | 'pink' | 'primary';
}

export function Checkbox({
  label,
  onChange,
  checked,
  className,
  color = 'primary',
  children
}: PropsWithChildren<CheckboxProps>) {
  const colorClass = {
    blue: 'checked:bg-blue-700',
    pink: 'checked:bg-pink-400',
    primary: 'checked:bg-primary'
  }[color];

  return (
    <label className={cx('relative inline-flex cursor-pointer items-center', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={cx(
          'h-6 w-6 cursor-pointer appearance-none rounded-lg border border-gray-300 checked:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all dark:border-gray-600 dark:focus:ring-blue-800',
          colorClass
        )}
      />
      <span className="ml-2 text-sm">{label}</span>
      {children}
    </label>
  );
}
