/**
 * @format
 * Web entry point
 */

import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create root and render app with error handling
try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  rootElement.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; flex-direction: column; padding: 20px;">
      <h1 style="color: #fff; margin-bottom: 20px;">Error al cargar la aplicación</h1>
      <p style="color: #ff3b30; margin-bottom: 10px;">${error.message}</p>
      <p style="color: #ccc;">Por favor, recarga la página o contacta al soporte.</p>
    </div>
  `;
}

