import Link from 'next/link';
import Image from 'next/image';

import Unsplash from './metrics/Unsplash';
import ImageWithTheme from './ImageWithTheme';
import Disclaimer from './Disclaimer';
import Waypoint from './Waypoint';

const CustomLink = (props) => {
  const href = props.href;
  const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));

  if (isInternalLink) {
    return (
      <Link href={href}>
        <a {...props}>{props.children}</a>
      </Link>
    );
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

const MDXComponents = {
  Image: RoundedImage,
  ImageWithTheme,
  a: CustomLink,
  Unsplash,
  Disclaimer,
  Waypoint
};

export default MDXComponents;
