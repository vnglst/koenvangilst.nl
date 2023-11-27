import Icon from './Icon';

export default function Waypoint({ href }) {
  return (
    <div className="my-5 md:ml-[-27px]">
      <Icon icon="external-link" className="h-4 w-4 ml-1 inline" />{' '}
      <a href={href} className="ml-2" target="_blank" rel="noopener noreferrer">
        Commit on Github
      </a>
    </div>
  );
}
