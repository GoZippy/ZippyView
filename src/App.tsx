import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProjectView } from './pages/ProjectView';
import { Settings } from './pages/Settings';
import { Auth } from './pages/Auth';

const App: React.FC = () => {
  const session = useSession();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" />} />
        <Route
          path="/"
          element={
            session ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/project/:id"
          element={
            session ? (
              <Layout>
                <ProjectView />
              </Layout>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            session ? (
              <Layout>
                <Settings />
              </Layout>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;