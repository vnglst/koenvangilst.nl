const icons = ['search', 'spinner', 'eye', 'external-link', 'arrow-right'];

type IconProps = {
  icon: (typeof icons)[number];
  className?: string;
};

export default function Icon({ icon, className }: IconProps) {
  return (
    <svg className={`${className}`} fill="currentColor">
      <use xlinkHref={`/static/icons/${icon}.svg#${icon}`} />
    </svg>
  );
}
