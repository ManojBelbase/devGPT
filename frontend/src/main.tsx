// src/main.tsx
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AppContextProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';

// Dispatch once before rendering

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Toaster position="top-right" />
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>

  </Provider>
);
