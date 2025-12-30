import React from 'react';
import { User, Dumbbell, LogOut } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const Header = () => {
  const { currentUser, logout } = useWorkout();

  return (
    <div className="bg-white text-black p-6 py-3 border-b border-gray">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Dumbbell className="w-8 h-8" />
          <h1 className="text-2xl font-bold hidden md:block">Project 1,000</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>{currentUser}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 btn btn-secondary"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;