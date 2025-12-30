import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useWorkout } from './context/WorkoutContext';
import AuthForm from './components/AuthForm';
import LandingPage from './pages/LandingPage';
import Header from './components/Header';
import Navigation from './components/Navigation';
import WorkoutsPage from './pages/WorkoutsPage';
import ExercisesPage from './pages/ExercisesPage';
import SchedulePage from './pages/SchedulePage';
import Loading from './components/Loading';

const App = () => {
  const { currentUser, currentTab } = useWorkout();
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);

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
    if (showAuthForm) {
      return <AuthForm />;
    }
    return <LandingPage onGetStarted={() => setShowAuthForm(true)} />;
  }

  return (
    <div className="min-h-screen bg-white pb-24">
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
      {currentTab === 'exercises' ? <ExercisesPage /> : currentTab === 'schedule' ? <SchedulePage /> : <WorkoutsPage />}
      <Navigation />
    </div>
  );
};

export default App;