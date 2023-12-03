import Icon from './Icon';

export default function ExternalLink({
  href,
  children,
  rel
}: {
  href: string;
  children: React.ReactNode;
  rel?: string;
}) {
  const extraRel = rel ? ` ${rel}` : '';

  return (
    <a
      className="text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel={`noopener noreferrer${extraRel}`}
      href={href}
    >
      {children}
      <Icon icon="external-link" className="ml-1 inline h-4 w-4" />
    </a>
  );
}
