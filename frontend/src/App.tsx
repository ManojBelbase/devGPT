import { useRoutes } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import "./assets/prism.css";
import { appRoutes } from "./routes/Routes";

function App() {
  const routes = useRoutes(appRoutes);

  return <AppContextProvider>{routes}</AppContextProvider>;
}

export default App;
