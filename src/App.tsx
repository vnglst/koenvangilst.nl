import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Lab } from './pages/Lab';
import { LabPost } from './pages/LabPost';
import { NotFound } from './pages/NotFound';
import { Photography } from './pages/Photography';
import { Tag } from './pages/Tag';

// Special lab pages
import { CO2Page } from './pages/lab/CO2Page';
import { ForestPage } from './pages/lab/ForestPage';
import { GenArtGalleryPage } from './pages/lab/GenArtGalleryPage';
import { OnsLandPage } from './pages/lab/OnsLandPage';
import { Prognosis2100Page } from './pages/lab/Prognosis2100Page';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lab">
          <Route index element={<Lab />} />
          <Route path="co2" element={<CO2Page />} />
          <Route path="forest" element={<ForestPage />} />
          <Route path="gen-art-gallery" element={<GenArtGalleryPage />} />
          <Route path="ons-land" element={<OnsLandPage />} />
          <Route path="prognosis-2100" element={<Prognosis2100Page />} />
          <Route path=":slug" element={<LabPost />} />
        </Route>
        <Route path="photography" element={<Photography />} />
        <Route path="tag/:slug" element={<Tag />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
