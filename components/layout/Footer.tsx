import { Link } from '../ui/Link';

const footerLinks = [
  { href: 'https://github.com/vnglst', label: 'GitHub' },
  { href: 'https://bsky.app/profile/vnglst.bsky.social', label: 'Bluesky' },
  { href: 'https://hachyderm.io/@vnglst', label: 'Mastodon' },
  { href: 'https://www.linkedin.com/in/vangilst/', label: 'LinkedIn' }
];

export function Footer() {
  return (
    <footer className="flex flex-col justify-center border-t border-dashed border-gray-400 p-6">
      <div className="mx-auto flex w-full max-w-[65ch] flex-col p-4 md:px-0">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-4">
          {footerLinks.map(({ href, label }) => (
            <div key={href} className="flex flex-col space-y-4">
              <Link href={href} className="font-normal no-underline">
                {label}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <span className="my-4 text-right text-xs text-gray-500">
        v. {process.env.APP_VERSION} |{' '}
        <a className="underline" href={`https://github.com/vnglst/koenvangilst.nl/tree/${process.env.COMMIT_HASH}`}>
          {process.env.COMMIT_HASH?.substring(0, 7) || 'no commit hash'}
        </a>
      </span>
    </footer>
  );
}
