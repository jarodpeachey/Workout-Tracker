import React from 'react';
import { useWorkout } from './context/WorkoutContext';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import WorkoutsPage from './pages/WorkoutsPage';
import ExercisesPage from './pages/ExercisesPage';

const App = () => {
  const { currentUser, currentTab } = useWorkout();

  if (!currentUser) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {currentTab === 'exercises' ? <ExercisesPage /> : <WorkoutsPage />}
    </div>
  );
};

export default App;