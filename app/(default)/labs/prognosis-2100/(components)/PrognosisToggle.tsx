'use client';

import { Toggle } from 'components/Toggle';

import { usePrognosis } from '../(store)/prognosis';

export function PrognosisToggle() {
  const togglePrognosis = usePrognosis((state) => state.toggle);
  const showPrognosis = usePrognosis((state) => state.showPrognosis);

  return (
    <Toggle
      label="Show prognosis"
      onChange={togglePrognosis}
      checked={showPrognosis}
    />
  );
}
