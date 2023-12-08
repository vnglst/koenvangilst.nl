import { unstable_noStore as noStore } from 'next/cache';

import { getViews } from 'services/supabase';

type ViewCountProps = {
  path: string;
  className?: string;
};

export async function ViewCount({ path, className }: ViewCountProps) {
  noStore();

  const views = await getViews(path);

  return (
    <span className={className}>
      <span className="fade-in">{`${
        views ? views.toLocaleString() : '–––'
      } `}</span>
      views
    </span>
  );
}
