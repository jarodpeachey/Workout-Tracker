import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useWorkout } from '../context/WorkoutContext';
import backgroundImage from '../blurry-gradient-haikei.png';
import logo from '../logo-2.png';
import Loading from './Loading';

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { /* login removed - auth handled by Supabase */ } = useWorkout();

  const handleAuth = async () => {
    if (!username || !password) {
      return;
    }
    
    if (password.length < 4) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: username,
        password
      });
      
      // If sign in succeeds, we're done (loading will stay until app changes)
      if (!signInError) {
        setPassword('');
        return;
      }
      
      // If sign in fails, try to register
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: username,
        password
      });
      
      if (signUpError) {
        console.error('Registration error:', signUpError);
        setIsLoading(false);
        return;
      }
      
      // Registration successful
      setPassword('');
      setIsLoading(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Auth error:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div 
      className="h-screen w-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Project 1,000" className="h-16 mt-4 mb-4" />
        </div>
        
        <div className="space-y-4">
          {showConfirmation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-60" onClick={() => setShowConfirmation(false)} />
              <div className="relative card w-full max-w-sm z-10 items-center justify-center">
                <h3 className="mb-2 text-center">Check your email</h3>
                <p className="mb-4 text-center">Please check your inbox for a confirmation email</p>
                <div className="text-center">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="btn btn-primary"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="block mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              className="w-full"
            />
          </div>
          
          <button
            onClick={handleAuth}
            className="w-full btn btn-primary"
          >
            Sign Up/Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;