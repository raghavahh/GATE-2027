import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Shell } from './ui/Shell';
import { Home } from './pages/Home';
import { PaperPage } from './pages/PaperPage';
import { TopicPage } from './pages/TopicPage';
import { GuidePage, Loading, NotFound, PapersPage } from './pages/Static';
import { devUnlockFromUrl } from './lib/store';
import { AuthProvider } from './lib/auth';

// Pages most visitors never open are downloaded only when visited (smaller first load on phones).
const named = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(() => load().then(m => ({ default: m[name] })));
const PyqPage = named(() => import('./pages/PyqPage'), 'PyqPage');
const AdminPage = named(() => import('./pages/AdminPage'), 'AdminPage');
const MePage = named(() => import('./pages/MePage'), 'MePage');
const AuthPage = named(() => import('./pages/AuthPage'), 'AuthPage');
const TermsPage = named(() => import('./pages/Legal'), 'TermsPage');
const PrivacyPage = named(() => import('./pages/Legal'), 'PrivacyPage');
const RefundPage = named(() => import('./pages/Legal'), 'RefundPage');
const DeliveryPage = named(() => import('./pages/Legal'), 'DeliveryPage');
const ContactPage = named(() => import('./pages/Legal'), 'ContactPage');
const AboutPage = named(() => import('./pages/Legal'), 'AboutPage');

devUnlockFromUrl();

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="papers" element={<PapersPage />} />
          <Route path="pyq" element={<PyqPage />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="account" element={<MePage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="refund" element={<RefundPage />} />
          <Route path="delivery" element={<DeliveryPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path=":paper" element={<PaperPage />} />
          <Route path=":paper/:topic" element={<TopicPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
    </AuthProvider>
  );
}
