// Ensure window.fetch has both getter and setter across all browser/iframe contexts
try {
  const origFetch = window.fetch;
  let currentFetch = origFetch;
  try {
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get: () => currentFetch,
      set: (fn) => {
        currentFetch = fn;
      },
    });
  } catch {
    try {
      Object.defineProperty(Window.prototype, 'fetch', {
        configurable: true,
        enumerable: true,
        get: () => currentFetch,
        set: (fn) => {
          currentFetch = fn;
        },
      });
    } catch {}
  }
} catch {}

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
