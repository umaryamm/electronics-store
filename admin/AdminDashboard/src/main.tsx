// src/main.tsx (or src/main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mounts the entire React ecosystem into the root HTML node
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);