/**
 * @format
 * Web entry point
 */

// Log inmediato para verificar que el script se ejecuta
console.log('🚀 [index.web.js] Script ejecutándose...');
console.log('🔍 [index.web.js] Document readyState:', document.readyState);
console.log('🔍 [index.web.js] Root element existe?', !!document.getElementById('root'));

import React from 'react';
console.log('✅ [index.web.js] React importado');

import {createRoot} from 'react-dom/client';
console.log('✅ [index.web.js] createRoot importado');

import App from './App';
console.log('✅ [index.web.js] App importado');

// Get root element
console.log('🔍 [index.web.js] Obteniendo root element...');
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ [index.web.js] Root element no encontrado!');
  throw new Error('Root element not found');
}

console.log('✅ [index.web.js] Root element encontrado:', rootElement);

// Create root and render app with error handling
try {
  console.log('🎨 [index.web.js] Creando root de React...');
  const root = createRoot(rootElement);
  
  console.log('🎨 [index.web.js] Renderizando aplicación...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('✅ [index.web.js] Aplicación renderizada correctamente!');
} catch (error) {
  console.error('❌ [index.web.js] ERROR al renderizar:', error);
  console.error('❌ [index.web.js] Stack:', error.stack);
  
  rootElement.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; flex-direction: column; padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #fff; margin-bottom: 20px; font-size: 24px;">Error al cargar la aplicación</h1>
      <p style="color: #ff3b30; margin-bottom: 10px; font-size: 16px;">${error.message || 'Error desconocido'}</p>
      <p style="color: #ccc; font-size: 14px; text-align: center; margin-bottom: 20px;">Por favor, recarga la página o contacta al soporte.</p>
      <pre style="color: #888; font-size: 12px; text-align: left; max-width: 600px; overflow: auto; background: #1a1a1a; padding: 15px; border-radius: 5px;">${error.stack || ''}</pre>
    </div>
  `;
}

