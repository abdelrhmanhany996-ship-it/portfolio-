import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ContentProvider } from './context/ContentContext';
import './index.css';

const AdminApp = lazy(() => import('./admin/AdminApp'));

const isAdminHash = () => window.location.hash.startsWith('#/admin');

function Root() {
  const [admin, setAdmin] = useState(isAdminHash);
  useEffect(() => {
    const onHash = () => setAdmin(isAdminHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <ContentProvider>
      {admin ? (
        <Suspense fallback={<div className="min-h-screen bg-[#080808]" />}>
          <AdminApp />
        </Suspense>
      ) : (
        <App />
      )}
    </ContentProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
