import { Link } from '#/components/ui/Link';

/** The page's section, shown above its title so readers arriving from anywhere can find the rest. */
export function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} variant="plain" className="section-link">
      {label}
    </Link>
  );
}
