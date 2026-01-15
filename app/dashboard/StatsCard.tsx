type StatsCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
};

export function StatsCard({ title, value, subtitle, icon, trend }: StatsCardProps) {
  return (
    <div className="border border-dashed border-gray-400 dark:border-none p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
          <p className="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
            {value}
          </p>
          {subtitle && <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="mt-1 md:mt-2 flex items-center gap-1">
              <span
                className={`text-xs md:text-sm font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        {icon && <div className="ml-2 md:ml-4 text-gray-400 dark:text-gray-600 flex-shrink-0">{icon}</div>}
      </div>
    </div>
  );
}
