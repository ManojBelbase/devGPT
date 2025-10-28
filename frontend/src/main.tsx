// src/main.tsx
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { RootProvider } from './context/RootProvider.tsx'; // Import RootProvider

createRoot(document.getElementById('root')!).render(
  <Router>
    <RootProvider>
      <App />
    </RootProvider>
  </Router>
);