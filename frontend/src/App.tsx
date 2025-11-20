// src/App.tsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './redux/store';
import { Routes, Route } from 'react-router-dom';
import { appRoutes } from './routes/Routes';
import { getCurrentUser } from './redux/thunks/authThunk';
import './assets/prism.css'

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (

    <Routes>

      {appRoutes.map((r, i) => (
        <Route key={i} path={r.path} element={r.element}>
          {r.children?.map((c, j) => (
            <Route key={j} path={c.path} element={c.element} />
          ))}
        </Route>
      ))}
    </Routes>
  );
}
