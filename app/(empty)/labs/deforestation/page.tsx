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
    <div className="mt-20 flex h-full w-full px-4 text-black md:mt-32 md:px-8 dark:text-white">
      <DeforestationMap />
    </div>
  );
}
