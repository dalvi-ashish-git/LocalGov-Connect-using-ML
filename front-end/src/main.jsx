import './index.css';
import App from './App.jsx';
import './assets/ms-bundle.css';
import { StrictMode } from 'react';
import './components/md3-components.js';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
