import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminPostersList } from './AdminPostersList';
import { AdminPosterForm } from './AdminPosterForm';
import { AdminDraftsList } from './AdminDraftsList';
import { AdminCategories } from './AdminCategories';
import { AdminCollections } from './AdminCollections';
import { AdminSettings } from './AdminSettings';
import { AdminPreviewPage } from './AdminPreviewPage';

export const AdminApp: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="posters" element={<AdminPostersList />} />
        <Route path="posters/new" element={<AdminPosterForm />} />
        <Route path="posters/edit/:id" element={<AdminPosterForm />} />
        <Route path="drafts" element={<AdminDraftsList />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="collections" element={<AdminCollections />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="preview/:slug" element={<AdminPreviewPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminApp;
