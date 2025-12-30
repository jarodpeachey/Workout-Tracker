import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { WorkoutProvider } from './context/WorkoutContext';
import './utils/migrateLocalToSupabase'; // attach migration helper to window for console use

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WorkoutProvider>
      <App />
    </WorkoutProvider>
  </React.StrictMode>,
);