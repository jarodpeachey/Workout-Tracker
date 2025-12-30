import React from 'react';
import { useWorkout } from '../context/WorkoutContext';

const Navigation = () => {
  const { currentTab, setCurrentTab } = useWorkout();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 bg-blue-700 rounded w-full justify-center">
          <button
            onClick={() => setCurrentTab('workouts')}
            className={`flex-1 px-4 py-3 text-center font-medium transition ${
              currentTab === 'workouts' 
                ? 'bg-white text-blue-700 rounded' 
                : 'text-white hover:bg-blue-600'
            }`}
          >
            Workouts
          </button>
          <button
            onClick={() => setCurrentTab('exercises')}
            className={`flex-1 px-4 py-3 text-center font-medium transition ${
              currentTab === 'exercises' 
                ? 'bg-white text-blue-700 rounded' 
                : 'text-white hover:bg-blue-600'
            }`}
          >
            Exercises
          </button>
          <button
            onClick={() => setCurrentTab('schedule')}
            className={`flex-1 px-4 py-3 text-center font-medium transition ${
              currentTab === 'schedule' 
                ? 'bg-white text-blue-700 rounded' 
                : 'text-white hover:bg-blue-600'
            }`}
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
