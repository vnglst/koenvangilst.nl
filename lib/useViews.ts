import useSWR from 'swr';
import fetcher from './fetcher';

type Views = {
  views: number;
};

export function useViews(pathname: string) {
  const { data } = useSWR<Views>(
    `/api/views/${encodeURIComponent(pathname)}`,
    fetcher
  );
  return { views: data?.views };
}
