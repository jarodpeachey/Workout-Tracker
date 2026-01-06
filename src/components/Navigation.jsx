import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Dumbbell, ListChecks, TrendingUp } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Hide navigation on dashboard
  if (currentPath === '/') {
    return null;
  }

  const navItems = [
    {
      path: '/schedule',
      label: 'Schedule',
      icon: Calendar,
    },
    {
      path: '/workouts',
      label: 'Workouts',
      icon: ListChecks,
    },
    {
      path: '/exercises',
      label: 'Exercises',
      icon: Dumbbell,
    },
    {
      path: '/stats',
      label: 'Stats',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray z-50" style={{ boxShadow: '0 -4px 12px 0 rgba(0, 0, 0, 0.08)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center w-full">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = currentPath === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-5 sm:py-4 transition-all relative group ${
                  isActive ? 'text-white' : 'text-text-secondary'
                }`}
              >
                {/* Active gradient background */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary"></div>
                )}
                
                {/* Hover gradient background (only when not active) */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-10 transition-opacity"></div>
                )}
                
                {/* Icon */}
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 relative z-10 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                
                {/* Text - hidden on mobile, shown on desktop */}
                <span className="hidden sm:inline font-normal relative z-10">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
