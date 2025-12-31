import React from 'react';
import { useWorkout } from '../context/WorkoutContext';

const Navigation = () => {
  const { currentTab, setCurrentTab } = useWorkout();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray" style={{ boxShadow: '0 -4px 12px 0 rgba(0, 0, 0, 0.08)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center w-full">
          <button
            onClick={() => setCurrentTab('schedule')}
            className={`tab ${currentTab === 'schedule' ? 'active' : ''}`}
          >
            Schedule
          </button>
          <button
            onClick={() => setCurrentTab('workouts')}
            className={`tab ${currentTab === 'workouts' ? 'active' : ''}`}
          >
            Workouts
          </button>
          <button
            onClick={() => setCurrentTab('exercises')}
            className={`tab ${currentTab === 'exercises' ? 'active' : ''}`}
          >
            Exercises
          </button>
          <button
            onClick={() => setCurrentTab('profile')}
            className={`tab ${currentTab === 'profile' ? 'active' : ''}`}
          >
            Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
