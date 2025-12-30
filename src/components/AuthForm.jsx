import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useWorkout();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }
    
    try {
      const result = await window.storage.get(`auth_${username}`);
      
      if (result) {
        const userData = JSON.parse(result.value);
        if (userData.password === password) {
          login(username);
          setPassword('');
        } else {
          alert('Invalid password');
        }
      } else {
        alert('User not found. Please register first.');
      }
    } catch (error) {
      alert('User not found. Please register first.');
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }
    
    if (password.length < 4) {
      alert('Password must be at least 4 characters');
      return;
    }
    
    try {
      const result = await window.storage.get(`auth_${username}`);
      
      if (result) {
        alert('Username already exists. Please choose a different username or login.');
        return;
      }
    } catch (error) {
      // User doesn't exist
    }
    
    try {
      await window.storage.set(`auth_${username}`, JSON.stringify({ password }));
      login(username);
      setPassword('');
      setIsRegistering(false);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error creating account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Dumbbell className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Workout Tracker
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {isRegistering ? 'Create your account' : 'Sign in to continue'}
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (isRegistering ? handleRegister() : handleLogin())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={isRegistering ? handleRegister : handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
          
          <div className="text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;