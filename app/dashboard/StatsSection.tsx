import { ReactNode } from 'react';

type StatsSectionProps = {
  title: string;
  description: string;
  isLoading: boolean;
  children?: ReactNode;
};

export function StatsSection({ title, description, isLoading, children }: StatsSectionProps) {
  return (
    <section className="border border-dashed border-gray-400 dark:border-none p-4 md:p-6">
      <div className="mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-2 md:space-x-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-6 md:w-8"></div>
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 md:w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 md:w-20"></div>
            </div>
          ))}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
