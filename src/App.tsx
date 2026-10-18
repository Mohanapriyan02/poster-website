import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CatalogProvider } from './context/CatalogContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { ScrollToTop } from './components/common/ScrollToTop';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { CategoryPage } from './pages/CategoryPage';
import { CollectionPage } from './pages/CollectionPage';
import { PosterDetailPage } from './pages/PosterDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin App (Dead-code eliminated and completely excluded in public build)
const AdminApp =
  import.meta.env.VITE_ENABLE_ADMIN !== 'false'
    ? lazy(() => import('./pages/admin/AdminApp'))
    : (() => null) as unknown as React.ComponentType;

// Public Showcase Layout Shell
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171717]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export function App() {
  const isAdminEnabled = import.meta.env.VITE_ENABLE_ADMIN !== 'false';

  return (
    <CatalogProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin Dashboard Routes (Isolated layout, no public headers/footers) */}
          {isAdminEnabled && (
            <Route
              path="/admin/*"
              element={
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-mono text-xs">
                      Loading CMS Console...
                    </div>
                  }
                >
                  <AdminApp />
                </Suspense>
              }
            />
          )}

          {/* Public Poster Showcase Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/posters" element={<ExplorePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/collection/:slug" element={<CollectionPage />} />
            <Route path="/poster/:slug" element={<PosterDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CatalogProvider>
  );
}

export default App;
