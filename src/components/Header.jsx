import React from 'react';
import { User, Dumbbell, LogOut } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const Header = () => {
  const { currentUser, logout } = useWorkout();

  return (
    <div className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Dumbbell className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Workout Tracker</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{currentUser}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;