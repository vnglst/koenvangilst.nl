import Link from 'next/link';

import ExternalLink from './ExternalLink';

export function Footer() {
  const footerLinks = [
    [
      { href: '/', label: 'Home' },
      { href: '/dashboard', label: 'Dashboard' }
    ],
    [
      { href: '/photography', label: 'Photography' },
      { href: 'https://github.com/vnglst', label: 'GitHub' }
    ],
    [
      {
        href: 'https://hachyderm.io/@vnglst',
        label: 'Mastodon'
      },
      {
        href: 'https://www.linkedin.com/in/vangilst/',
        label: 'LinkedIn'
      }
    ],
    [
      {
        href: 'https://bsky.app/profile/vnglst.bsky.social',
        label: 'Bluesky'
      }
    ]
  ];

  return (
    <footer className="flex flex-col justify-center border-t border-dashed border-gray-400 p-6">
      <div className="mx-auto flex w-full max-w-[65ch] flex-col p-4 md:px-0">
        <div className="grid w-full grid-cols-1 justify-between gap-4 sm:grid-cols-4">
          {footerLinks.map((links, index) => (
            <FooterLinkGroup key={index}>
              {links.map(({ href, label }) => (
                <FooterLink key={href} href={href}>
                  {label}
                </FooterLink>
              ))}
            </FooterLinkGroup>
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

function FooterLinkGroup({ children }) {
  return <div className="flex flex-col space-y-4">{children}</div>;
}

function FooterLink({ href, children }) {
  const isExternal = href.startsWith('http');
  const Cmp = isExternal ? ExternalLink : InternalLink;
  return <Cmp href={href}>{children}</Cmp>;
}

function InternalLink({ href, children }) {
  return (
    <Link
      href={href}
      className="w-fit text-gray-600 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
    >
      {children}
    </Link>
  );
}
