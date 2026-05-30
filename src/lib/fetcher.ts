export async function fetcher<TData = unknown>(input: RequestInfo, init?: RequestInit): Promise<TData> {
  const res = await fetch(input, init);
  return res.json();
}
