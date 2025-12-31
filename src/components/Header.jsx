import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import logo from '../logo-2.png';

const Header = () => {
  const { currentUser, logout } = useWorkout();
  const navigate = useNavigate();

  return (
    <div className="bg-white text-black p-6 py-3 border-b border-gray">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
        >
          <img src={logo} alt="Project 1,000" className="h-10" />
        </button>
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