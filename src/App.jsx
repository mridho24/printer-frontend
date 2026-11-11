import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MasterDataPage from './pages/MasterDataPage.jsx';
import PermintaanPage from './pages/PermintaanPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="master-data" element={<Navigate to="/master-data/jenis" replace />} />
          <Route path="master-data/:tab" element={<MasterDataPage />} />
          <Route path="permintaan" element={<PermintaanPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
