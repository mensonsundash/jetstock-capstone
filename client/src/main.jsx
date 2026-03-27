import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './app/AppProviders.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* enable routing */}
    <BrowserRouter>
      {/* wrapping theme and app-level contexts */}
      <AppProviders>
        {/* Main app entry point */}
        <App />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
)
