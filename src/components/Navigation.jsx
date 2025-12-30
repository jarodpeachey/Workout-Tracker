import React from 'react';
import { useWorkout } from '../context/WorkoutContext';

const Navigation = () => {
  const { currentTab, setCurrentTab } = useWorkout();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t-2 border-dark-border shadow-gym">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 w-full justify-center">
          <button
            onClick={() => setCurrentTab('schedule')}
            className={`flex-1 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider transition ${
              currentTab === 'schedule' 
                ? 'bg-accent-blue text-white' 
                : 'bg-dark-lighter text-text-secondary hover:bg-dark-border'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setCurrentTab('workouts')}
            className={`flex-1 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider transition ${
              currentTab === 'workouts' 
                ? 'bg-accent-blue text-white' 
                : 'bg-dark-lighter text-text-secondary hover:bg-dark-border'
            }`}
          >
            Workouts
          </button>
          <button
            onClick={() => setCurrentTab('exercises')}
            className={`flex-1 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider transition ${
              currentTab === 'exercises' 
                ? 'bg-accent-blue text-white' 
                : 'bg-dark-lighter text-text-secondary hover:bg-dark-border'
            }`}
          >
            Exercises
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
