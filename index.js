
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const elementoRoot = document.getElementById('root');

if (elementoRoot) {
  createRoot(elementoRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
