import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Removed: import './index.css';
// Removed: import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Removed: reportWebVitals();
