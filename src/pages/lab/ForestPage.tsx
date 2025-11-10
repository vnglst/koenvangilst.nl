import { Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../../app/lab/forest/config';
import { ForestWatch } from '../../../app/lab/forest/ForestWatch';
import { getBaseLayers } from '../../../app/lab/forest/getBaseLayers';

import '../../../app/lab/forest/styles.css';

export function ForestPage() {
  const [baseLayers, setBaseLayers] = useState<any>(null);

  useEffect(() => {
    getBaseLayers({
      url: CONFIG.url,
      yearsBack: parseInt(CONFIG.yearsBack)
    }).then(setBaseLayers);
  }, []);

  if (!baseLayers) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Forest Watch | Koen van Gilst</title>
        <meta
          name="description"
          content="Keep track of forests in your area. Get a detailed view of changes in forest cover over time."
        />
      </Helmet>
      <div className="flex h-screen w-full bg-slate-200 px-4 pt-20 pb-6 text-black md:px-8 md:pt-24 dark:bg-slate-800 dark:text-white">
        <Suspense>
          <ForestWatch baseLayers={baseLayers} />
        </Suspense>
      </div>
    </>
  );
}
