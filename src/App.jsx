import React from 'react';
import { useWorkout } from './context/WorkoutContext';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Navigation from './components/Navigation';
import WorkoutsPage from './pages/WorkoutsPage';
import ExercisesPage from './pages/ExercisesPage';
import SchedulePage from './pages/SchedulePage';

const App = () => {
  const { currentUser, currentTab } = useWorkout();

  if (!currentUser) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      {currentTab === 'exercises' ? <ExercisesPage /> : currentTab === 'schedule' ? <SchedulePage /> : <WorkoutsPage />}
      <Navigation />
    </div>
  );
};

export default App;