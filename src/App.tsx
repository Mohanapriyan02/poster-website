import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnnouncementBar } from "./components/layout/AnnouncementBar";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { FloatingWhatsApp } from "./components/common/FloatingWhatsApp";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Pages
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { CategoryPage } from "./pages/CategoryPage";
import { CollectionPage } from "./pages/CollectionPage";
import { PosterDetailPage } from "./pages/PosterDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";

export function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171717]">
        {/* Top Announcement Bar */}
        <AnnouncementBar />

        {/* Sticky Editorial Header */}
        <Navbar />

        {/* Main Routed Page Content */}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posters" element={<ExplorePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/collection/:slug" element={<CollectionPage />} />
            <Route path="/poster/:slug" element={<PosterDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Gallery Footer */}
        <Footer />

        {/* Persistent Floating WhatsApp CTA */}
        <FloatingWhatsApp />
      </div>
    </Router>
  );
}

export default App;
