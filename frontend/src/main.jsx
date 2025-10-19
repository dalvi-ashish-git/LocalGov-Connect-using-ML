import './index.css';
import App from './App.jsx';
import './assets/ms-bundle.css';
import { StrictMode } from 'react';
import './components/md3-components.js';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
