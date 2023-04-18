import fetcher from '../lib/fetcher';
import { getOrigin } from '../lib/vercel.utils';

export function getAbsolutePath(relativePath: string) {
  const origin = getOrigin();
  return new URL(relativePath, origin).toString();
}

function get<JSON = unknown>(relativePath: string, init?: RequestInit) {
  const url = getAbsolutePath(relativePath);
  return fetcher<JSON>(url, init);
}

export const api = {
  get
};
