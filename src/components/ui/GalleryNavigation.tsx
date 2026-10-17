import { Button } from './Button';

type GalleryNavigationProps = {
  label: string;
  previousLabel: string;
  nextLabel: string;
  previousDisabled: boolean;
  nextDisabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
  immersive?: boolean;
};

export function GalleryNavigation({
  label,
  previousLabel,
  nextLabel,
  previousDisabled,
  nextDisabled,
  onPrevious,
  onNext,
  immersive = false
}: GalleryNavigationProps) {
  return (
    <nav className={immersive ? 'photo-viewer-controls' : 'art-controls'} aria-label={label}>
      <Button variant="bare" aria-label={previousLabel} disabled={previousDisabled} onClick={onPrevious}>
        {immersive ? '←' : '← Previous'}
      </Button>
      <Button variant="bare" aria-label={nextLabel} disabled={nextDisabled} onClick={onNext}>
        {immersive ? '→' : 'Next →'}
      </Button>
    </nav>
  );
}
