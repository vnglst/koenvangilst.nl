type IconName = 'external-link' | 'arrow-left';

type IconProps = {
  icon: IconName;
  className?: string;
};

// Match each sprite's own viewBox so the icon scales to its box instead of being clipped.
const VIEW_BOXES: Record<IconName, string> = {
  'external-link': '0 0 12 12',
  'arrow-left': '0 0 20 20'
};

export function Icon({ icon, className }: IconProps) {
  return (
    <svg className={className} viewBox={VIEW_BOXES[icon]} aria-hidden="true" fill="currentColor">
      <use href={`/static/icons/${icon}.svg#${icon}`} />
    </svg>
  );
}
