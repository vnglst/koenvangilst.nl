import { cx } from 'lib/clsx';

type IconProps = {
  icon: 'search' | 'spinner' | 'eye' | 'external-link' | 'arrow-right' | 'info' | 'plus' | 'minus' | 'sun' | 'moon';
  className?: string;
};

export function Icon({ icon, className }: IconProps) {
  return (
    <svg className={cx(className)} fill="currentColor">
      <use xlinkHref={`/static/icons/${icon}.svg#${icon}`} />
    </svg>
  );
}
