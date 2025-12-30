import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useWorkout } from '../context/WorkoutContext';

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { /* login removed - auth handled by Supabase */ } = useWorkout();

  const handleLogin = async () => {
    if (!username || !password) {
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password
      });
      if (error) {
        return;
      }
      // onAuthStateChange in context will pick up the logged-in user
      setPassword('');
    } catch (error) {
      console.error('Login error', error);
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      return;
    }
    
    if (password.length < 4) {
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: username,
        password
      });
      if (error) {
        return;
      }
      // Supabase may send a confirmation email depending on your project settings.
      setPassword('');
      setIsRegistering(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Dumbbell className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Project 1,000
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {isRegistering ? 'Create your account' : 'Sign in to continue'}
        </p>
        
        <div className="space-y-4">
          {showConfirmation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowConfirmation(false)} />
              <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-sm z-10">
                <h3 className="text-lg font-semibold mb-2">Check your email</h3>
                <p className="text-sm text-gray-700 mb-4">Please check your inbox for a confirmation email</p>
                <div className="text-right">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
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