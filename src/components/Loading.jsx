import React, { useEffect, useState } from 'react';
import './Loading.css';
import backgroundImage from '../blurry-gradient-haikei.png';
import logo from '../logo-2.png';

const Loading = ({ timeout = 2000 }) => {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => setShow(false), timeout);
    
    return () => {
      clearTimeout(timer);
      // Re-enable scrolling
      document.body.style.overflow = '';
    };
  }, [timeout]);
  
  if (!show) return null;
  
  return (
    <div 
      className="loading-spinner-container min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}
    >
      <img 
        src={logo} 
        alt="Project 1,000" 
        className="pulsating-logo"
      />
    </div>
  );
};

export default Loading;
