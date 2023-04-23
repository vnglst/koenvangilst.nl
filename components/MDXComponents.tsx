import Image from 'next/image';
import Link from 'next/link';

import Unsplash from './metrics/Unsplash';
import Disclaimer from './Disclaimer';
import Waypoint from './Waypoint';

const CustomLink = (props) => {
  const href = props.href;
  const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));

  if (isInternalLink) {
    return (
      <Link href={href} {...props}>
        {props.children}
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
  a: CustomLink,
  Unsplash,
  Disclaimer,
  Waypoint
};

export default MDXComponents;
