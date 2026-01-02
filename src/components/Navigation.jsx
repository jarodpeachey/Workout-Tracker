import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Hide navigation on dashboard
  if (currentPath === '/') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray z-50" style={{ boxShadow: '0 -4px 12px 0 rgba(0, 0, 0, 0.08)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center w-full">
          <Link
            to="/schedule"
            className={`tab ${currentPath === '/schedule' ? 'active' : ''}`}
          >
            Schedule
          </Link>
          <Link
            to="/workouts"
            className={`tab ${currentPath === '/workouts' ? 'active' : ''}`}
          >
            Workouts
          </Link>
          <Link
            to="/exercises"
            className={`tab ${currentPath === '/exercises' ? 'active' : ''}`}
          >
            Exercises
          </Link>
          <Link
            to="/stats"
            className={`tab ${currentPath === '/stats' ? 'active' : ''}`}
          >
            Stats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
