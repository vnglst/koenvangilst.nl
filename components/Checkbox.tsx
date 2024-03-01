import React, { ChangeEvent, PropsWithChildren } from 'react';

interface CheckboxProps {
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  className?: string;
  color?: 'blue' | 'pink';
}

export function Checkbox({
  label,
  onChange,
  checked,
  className,
  color,
  children
}: PropsWithChildren<CheckboxProps>) {
  let colorClass = '';

  switch (color) {
    case 'blue':
      colorClass = 'checked:bg-blue-700';
      break;
    case 'pink':
      colorClass = 'checked:bg-pink-400';
      break;
    default:
      colorClass = 'checked:bg-primary-bright';
      break;
  }

  return (
    <label
      className={`relative inline-flex cursor-pointer items-center ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`h-6 w-6 appearance-none rounded-md border border-gray-300 checked:border-transparent ${colorClass} focus:outline-none`}
      />
      <span className={`ml-2 text-sm ${color}`}>{label}</span>
      {children}
    </label>
  );
}
