import { HashRouter, Route, Routes } from 'react-router-dom';
import { Shell } from './ui/Shell';
import { Home } from './pages/Home';
import { PaperPage } from './pages/PaperPage';
import { TopicPage } from './pages/TopicPage';
import { GuidePage, NotFound, PapersPage, PyqPage } from './pages/Static';
import { devUnlockFromUrl } from './lib/store';
import { AuthProvider } from './lib/auth';
import { AdminPage } from './pages/AdminPage';

devUnlockFromUrl();

export default function App() {
  return (
    <AuthProvider>
    <HashRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="papers" element={<PapersPage />} />
          <Route path="pyq" element={<PyqPage />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path=":paper" element={<PaperPage />} />
          <Route path=":paper/:topic" element={<TopicPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
    </AuthProvider>
  );
}
