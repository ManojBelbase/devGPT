import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter as Router} from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.tsx'

createRoot(document.getElementById('root')!).render(
  <Router>
    <AppContextProvider>
    <App />
    </AppContextProvider>
  </Router>,
)
