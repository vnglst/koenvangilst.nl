import { ChangeEvent, PropsWithChildren } from 'react';

import { cx } from 'lib/clsx';

interface ToggleProps {
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  className?: string;
}

export function Toggle({ label, onChange, checked, className, children }: PropsWithChildren<ToggleProps>) {
  return (
    <label className={cx('relative inline-flex cursor-pointer items-center', className)}>
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-500 dark:peer-focus:ring-blue-700 rtl:peer-checked:after:-translate-x-full"></div>
      {label ? (
        <span className="sr-only ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
      ) : null}
      {children}
    </label>
  );
}
