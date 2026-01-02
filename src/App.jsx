import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { currentUser } = useWorkout();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
import { Toaster } from 'react-hot-toast';
import { useWorkout } from './context/WorkoutContext';
import AuthForm from './components/AuthForm';
import LandingPage from './pages/LandingPage';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ScrollToTop from './components/ScrollToTop';
import WorkoutsPage from './pages/WorkoutsPage';
import ExercisesPage from './pages/ExercisesPage';
import SchedulePage from './pages/SchedulePage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import Loading from './components/Loading';

const App = () => {
  const { currentUser, globalLoading } = useWorkout();
  const [checkingUser, setCheckingUser] = useState(true);
  const [userExists, setUserExists] = useState(false);

  
  useEffect(() => {
    // Check for user in background, but don't show loader on landing page
    async function checkUser() {
      // Try to get user from supabase
      const { data } = await import('./utils/supabaseClient').then(m => m.supabase.auth.getUser());
      if (data?.user) {
        setUserExists(true);
      }
      setCheckingUser(false);
    }
    checkUser();
  }, []);

  // If checking for user, just render nothing (or a splash if desired)
  if (checkingUser) return null;

  // If on landing page, never show loader
  if (!userExists || !currentUser) {
    return (
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // If user exists and we're loading data, show loader
  if (globalLoading) {
    return <Loading timeout={2000} />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen pb-24">
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f7f7f7',
            border: '2px solid #3a3a3a',
            fontSize: '14px',
            fontWeight: '600',
          },
          success: {
            iconTheme: {
              primary: '#90a959',
              secondary: '#1a1a1a',
            },
          },
        }} />
        <Header />
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="/schedule" element={
            <PrivateRoute>
              <SchedulePage />
            </PrivateRoute>
          } />
          <Route path="/workouts" element={
            <PrivateRoute>
              <WorkoutsPage />
            </PrivateRoute>
          } />
          <Route path="/exercises" element={
            <PrivateRoute>
              <ExercisesPage />
            </PrivateRoute>
          } />
          <Route path="/stats" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
};

export default App;