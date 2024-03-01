import Container from './Container';

import '@arcgis/core/assets/esri/themes/dark/main.css';

export const metadata = {
  title: 'Deforestation Tracker',
  description:
    'Keep track of deforestation in your area. Get a detailed view of changes in forest cover over time.'
};

export default async function Deforestation() {
  return (
    <div className="flex h-full w-full p-4 text-black md:px-8 dark:text-white">
      <Container />
    </div>
  );
}
