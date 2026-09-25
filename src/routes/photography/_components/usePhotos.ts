import { useEffect, useState } from 'react';

import type { PhotoType } from '#/lib/photos';

export function usePhotos() {
  const [photos, setPhotos] = useState<PhotoType[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/photos-data.json', { cache: 'no-cache' })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load photography data: ${response.status}`);
        return response.json() as Promise<PhotoType[]>;
      })
      .then((data) => {
        if (!cancelled) setPhotos(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { photos, failed };
}
