import { PropsWithChildren } from 'react';

import { cx } from 'lib/clsx';

type ChartSectionProps = {
  /** Extra classes to append to the wrapper */
  className?: string;
};

/**
 * Standardized wrapper for scrollable chart sections (e.g., heatmaps).
 * - Prevents page overflow while allowing horizontal scroll when needed
 * - Provides a sensible base width that doesn’t exceed the container
 * - Supports optional full-bleed on large screens
 */
export function ChartSection({ children, className }: PropsWithChildren<ChartSectionProps>) {
  return (
    <div
      className={cx(
        'my-4 w-[600px] max-w-full overflow-x-auto overflow-y-hidden border border-dashed border-gray-400 md:min-h-0 dark:border-none',
        className
      )}
    >
      {children}
    </div>
  );
}
