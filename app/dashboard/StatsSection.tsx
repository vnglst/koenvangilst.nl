import { ReactNode } from 'react';

type StatsSectionProps = {
  title: string;
  description: string;
  isLoading: boolean;
  children?: ReactNode;
};

export function StatsSection({ title, description, isLoading, children }: StatsSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-8"></div>
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
            </div>
          ))}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
