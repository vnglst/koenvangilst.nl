import { Icon } from 'components/ui/Icon';

const footerLinks = [
  {
    href: 'mailto:koen@koenvangilst.nl',
    label: 'mail',
    icon: 'mail' as const
  },
  {
    href: 'https://bsky.app/profile/vnglst.bsky.social',
    label: 'bluesky',
    icon: 'bluesky' as const
  },
  {
    href: 'https://hachyderm.io/@vnglst',
    label: 'mastodon',
    icon: 'mastodon' as const
  },
  {
    href: 'https://github.com/vnglst',
    label: 'github',
    icon: 'github' as const
  },
  {
    href: 'https://www.linkedin.com/in/vangilst/',
    label: 'linkedin',
    icon: 'linkedin' as const
  }
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="my-16 text-sm text-gray-400 dark:text-gray-500">
      <div className="mb-2 flex items-center justify-between">
        <div>© {currentYear} Koen van Gilst</div>
        <div className="flex space-x-2">
          {footerLinks.map(({ href, label, icon }) => (
            <a
              key={href}
              className="text-sm text-gray-400 transition hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
              href={href}
            >
              <span className="sr-only">{label}</span>
              <Icon icon={icon} className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>
      </div>
      <div className="text-right text-xs text-gray-400 dark:text-gray-600">
        v. {process.env.APP_VERSION} |{' '}
        <a
          className="hover:underline"
          href={`https://github.com/vnglst/koenvangilst.nl/tree/${process.env.COMMIT_HASH}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {process.env.COMMIT_HASH?.substring(0, 7) || 'no commit hash'}
        </a>
      </div>
    </footer>
  );
}
