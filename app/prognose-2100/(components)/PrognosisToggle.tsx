'use client';

import { usePrognosis } from '../(store)/prognosis';

export function PrognosisToggle() {
  const togglePrognosis = usePrognosis((state) => state.toggle);
  const showPrognosis = usePrognosis((state) => state.showPrognosis);

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        value={showPrognosis ? 'on' : 'off'}
        onChange={togglePrognosis}
        className="peer sr-only"
      />
      <div className="peer-checked:bg-primary-bright peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-primary"></div>
      <span className="sr-only ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        Show prognosis
      </span>
    </label>
  );
}
