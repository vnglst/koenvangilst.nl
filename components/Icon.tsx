type IconProps = {
  icon: 'search' | 'spinner' | 'eye' | 'external-link';
  className?: string;
};

export default function Icon({ icon, className }: IconProps) {
  return (
    <svg className={`${className}`} fill="currentColor">
      <use xlinkHref={`/static/icons/${icon}.svg#${icon}`} />
    </svg>
  );
}
