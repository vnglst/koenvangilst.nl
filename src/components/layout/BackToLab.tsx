import { Link } from '#/components/ui/Link';

export function BackToLab() {
  return (
    <Link href="/lab" variant="plain" className="page-back-link">
      <span aria-hidden="true">←</span>
      <span className="page-back-label">Back to Lab</span>
    </Link>
  );
}
