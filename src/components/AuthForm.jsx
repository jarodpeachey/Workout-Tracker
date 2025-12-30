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
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Dumbbell className="w-12 h-12 text-accent-blue" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-text-primary">
          Project 1,000
        </h1>
        <p className="text-center text-text-secondary mb-6">
          {isRegistering ? 'Create your account' : 'Sign in to continue'}
        </p>
        
        <div className="space-y-4">
          {showConfirmation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-60" onClick={() => setShowConfirmation(false)} />
              <div className="relative bg-dark-card border-2 border-dark-border shadow-gym p-6 w-full max-w-sm z-10">
                <h3 className="text-lg font-semibold mb-2 text-text-primary">Check your email</h3>
                <p className="text-sm text-text-secondary mb-4">Please check your inbox for a confirmation email</p>
                <div className="text-right">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="btn-primary"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (isRegistering ? handleRegister() : handleLogin())}
              className="input w-full"
            />
          </div>
          
          <button
            onClick={isRegistering ? handleRegister : handleLogin}
            className="w-full btn-primary"
          >
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
          
          <div className="text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-accent-blue hover:text-accent-blue-dim text-sm font-medium transition"
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