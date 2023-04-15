function getProtocol() {
  const isProd = process.env.VERCEL_ENV === 'production';
  if (isProd) return 'https://';
  return 'http://';
}

export function getOrigin() {
  const protocol = getProtocol();

  if (process.env.VERCEL_URL) {
    return `${protocol}${process.env.VERCEL_URL}`;
  }

  return `${protocol}localhost:3000`;
}
