const icons = ['search', 'spinner', 'eye', 'external-link', 'arrow-right', 'info', 'plus', 'minus'];

type IconProps = {
  icon: (typeof icons)[number];
  className?: string;
};

export function Icon({ icon, className }: IconProps) {
  return (
    <svg className={`${className}`} fill="currentColor">
      <use xlinkHref={`/static/icons/${icon}.svg#${icon}`} />
    </svg>
  );
}
