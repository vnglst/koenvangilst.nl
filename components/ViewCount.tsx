type ViewCountProps = {
  views?: number;
  className?: string;
};

export function ViewCount({ views, className }: ViewCountProps) {
  return (
    <span className={className}>
      <span className="fade-in">{`${
        views ? views.toLocaleString() : '–––'
      } `}</span>
      views
    </span>
  );
}
