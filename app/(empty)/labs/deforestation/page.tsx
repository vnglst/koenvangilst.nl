import DeforestationMap from './DeforestationMap';

import '@arcgis/core/assets/esri/themes/dark/main.css';
import './styles.css';

export const metadata = {
  title: 'Deforestation Tracker',
  description:
    'Keep track of deforestation in your area. Get a detailed view of changes in forest cover over time.'
};

export default async function Deforestation() {
  return (
    <div className="flex h-full w-full bg-slate-200 px-4 pb-6 pt-20 text-black md:px-8 md:pt-28 dark:bg-slate-800 dark:text-white">
      <DeforestationMap />
    </div>
  );
}
