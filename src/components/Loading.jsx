import React, { useEffect, useState } from 'react';
import './Loading.css';

const Loading = ({ timeout = 2000 }) => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), timeout);
    return () => clearTimeout(timer);
  }, [timeout]);
  if (!show) return null;
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default Loading;
