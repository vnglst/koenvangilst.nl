type IconProps = {
  icon: 'external-link' | 'arrow-left';
  className?: string;
};

export function Icon({ icon, className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" fill="currentColor">
      <use href={`/static/icons/${icon}.svg#${icon}`} />
    </svg>
  );
}
