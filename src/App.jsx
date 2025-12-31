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
  const { currentUser } = useWorkout();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return (
      <Loading timeout={2000} />
    );
  }

  if (!currentUser) {
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