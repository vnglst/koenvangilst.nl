'use client';

import { Toggle } from 'components/forms/Toggle';

import { usePrognosisStore } from '../(store)/prognosis';

export function PrognosisToggle() {
  const { showPrognosis, togglePrognosis } = usePrognosisStore();

  return <Toggle label="Show prognosis" onChange={togglePrognosis} checked={showPrognosis} />;
}
