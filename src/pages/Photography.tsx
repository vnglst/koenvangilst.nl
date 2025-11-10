import { Helmet } from 'react-helmet-async';

// Import the original Photography component
import OriginalPhotography from '../../app/photography/page';

export function Photography() {
  return (
    <>
      <Helmet>
        <title>Photography | Koen van Gilst</title>
        <meta name="description" content="Photography by Koen van Gilst" />
      </Helmet>
      <OriginalPhotography />
    </>
  );
}
