import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useWorkout } from './context/WorkoutContext';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Navigation from './components/Navigation';
import WorkoutsPage from './pages/WorkoutsPage';
import ExercisesPage from './pages/ExercisesPage';
import SchedulePage from './pages/SchedulePage';
import Loading from './components/Loading';

const App = () => {
  const { currentUser, currentTab } = useWorkout();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loading timeout={2000} />
      </div>
    );
  }

  if (!currentUser) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1a1a1a',
          color: '#ffffffF2',
          border: '2px solid #2a2a2a',
          fontSize: '14px',
          fontWeight: '600',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
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