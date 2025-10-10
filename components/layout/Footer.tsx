const footerLinks = [
  {
    href: 'mailto:koen@koenvangilst.nl',
    label: 'mail',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="h-[18px] w-[18px] fill-current">
        <path d="M2.003 5.884 10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884z" />
        <path d="m18 8.118-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z" />
      </svg>
    )
  },
  {
    href: 'https://bsky.app/profile/vnglst.bsky.social',
    label: 'bluesky',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568 501" className="h-[18px] w-[18px] fill-current">
        <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z" />
      </svg>
    )
  },
  {
    href: 'https://hachyderm.io/@vnglst',
    label: 'mastodon',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="h-[18px] w-[18px] fill-current"
      >
        <path d="M11.19 12.195c2.016-.24 3.77-1.475 3.99-2.603.348-1.778.32-4.339.32-4.339 0-3.47-2.286-4.488-2.286-4.488C12.062.238 10.083.017 8.027 0h-.05C5.92.017 3.942.238 2.79.765c0 0-2.285 1.017-2.285 4.488l-.002.662c-.004.64-.007 1.35.011 2.091.083 3.394.626 6.74 3.78 7.57 1.454.383 2.703.463 3.709.408 1.823-.1 2.847-.647 2.847-.647l-.06-1.317s-1.303.41-2.767.36c-1.45-.05-2.98-.156-3.215-1.928a3.614 3.614 0 0 1-.033-.496s1.424.346 3.228.428c1.103.05 2.137-.064 3.188-.189zm1.613-2.47H11.13v-4.08c0-.859-.364-1.295-1.091-1.295-.804 0-1.207.517-1.207 1.541v2.233H7.168V5.89c0-1.024-.403-1.541-1.207-1.541-.727 0-1.091.436-1.091 1.296v4.079H3.197V5.522c0-.859.22-1.541.66-2.046.456-.505 1.052-.764 1.793-.764.856 0 1.504.328 1.933.983L8 4.39l.417-.695c.429-.655 1.077-.983 1.934-.983.74 0 1.336.259 1.791.764.442.505.661 1.187.661 2.046v4.203z" />
      </svg>
    )
  },
  {
    href: 'https://github.com/vnglst',
    label: 'github',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] fill-current">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    )
  },
  {
    href: 'https://www.linkedin.com/in/vangilst/',
    label: 'linkedin',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
  }
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 text-sm text-gray-400 md:w-9/12 dark:text-gray-500">
      <div className="mb-2 flex items-center justify-between">
        <div>© {currentYear} Koen van Gilst.</div>
        <div className="flex space-x-2">
          {footerLinks.map(({ href, label, icon }) => (
            <a
              key={href}
              className="text-sm text-gray-500 transition hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
              href={href}
            >
              <span className="sr-only">{label}</span>
              {icon}
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
