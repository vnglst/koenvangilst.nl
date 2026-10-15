import { Link } from '#/components/ui/Link';

const footerLinks = [
  {
    href: 'https://bsky.app/profile/vnglst.bsky.social',
    label: 'bluesky'
  },
  {
    href: 'https://hachyderm.io/@vnglst',
    label: 'mastodon'
  },
  {
    href: 'https://github.com/vnglst',
    label: 'github'
  },
  {
    href: 'https://www.linkedin.com/in/vangilst/',
    label: 'linkedin'
  }
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const commitHash = import.meta.env.VITE_COMMIT_HASH as string | undefined;
  const appVersion = import.meta.env.VITE_APP_VERSION as string | undefined;

  return (
    <footer className="site-footer">
      <div className="site-footer-links">
        {footerLinks.map(({ href, label }) => (
          <Link key={href} href={href} variant="plain" externalIndicator={false}>
            {label}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
        <div>© {currentYear} Koen van Gilst</div>
        <div className="">
          v. {appVersion} |{' '}
          <Link
            variant="plain"
            externalIndicator={false}
            className="hover:underline"
            href={`https://github.com/vnglst/koenvangilst.nl/tree/${commitHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {commitHash?.substring(0, 7) || 'no commit hash'}
          </Link>
        </div>
      </div>
    </footer>
  );
}
