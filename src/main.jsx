import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { initAuth } from './auth.js'
import App from './App.jsx'

initAuth().then(authenticated => {
  if (!authenticated) return;
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
