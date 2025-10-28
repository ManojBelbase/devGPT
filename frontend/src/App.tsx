// src/App.tsx
import { useRoutes } from "react-router-dom";
import "./assets/prism.css";
import { appRoutes } from "./routes/Routes";
import { Toaster } from "react-hot-toast";

function App() {
  const routes = useRoutes(appRoutes);

  return (
    <>
      <Toaster position="top-right" />
      {routes}
    </>
  );
}

export default App;