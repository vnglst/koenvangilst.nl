import Image from 'next/image';
import Link from 'next/link';

import { Disclaimer } from './Disclaimer';
import { Waypoint } from './Waypoint';

const CustomLink = (props) => {
  const href = props.href;
  const isExternalLink = href && href.startsWith('http');

  if (isExternalLink)
    return <a target="_blank" rel="noopener noreferrer" {...props} />;

  return (
    <Link href={href} {...props}>
      {props.children}
    </Link>
  );
};

function RoundedImage(props) {
  return (
    <Image
      alt={props.alt}
      className="my-1 inline-block rounded-lg"
      {...props}
    />
  );
}

export const components = {
  Image: RoundedImage,
  a: CustomLink,
  Disclaimer,
  Waypoint
};
