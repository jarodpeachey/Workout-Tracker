import React from 'react';
import { User, Dumbbell, LogOut } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const Header = () => {
  const { currentUser, logout } = useWorkout();

  return (
    <div className="bg-black text-white p-3 border-b-2 border-text-secondary">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Dumbbell className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Project 1,000</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{currentUser}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 btn-secondary"
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