import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import { useAppContext } from "../context/AppContext";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useAppContext();

  return (
    <div className={theme === "dark" ? "dark bg-[#121212] text-white" : "bg-white text-black"}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`
            fixed md:relative z-50 
            h-full border-r border-gray-200 
            w-72 
            transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            transition-transform duration-300 ease-in-out
            md:translate-x-0
          `}
        >
          <Sidebar />
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 ml-0 md:ml-2 overflow-auto transition-colors duration-300">
          {/* Mobile toggle button */}
          <button
            className="md:hidden p-2 m-2 bg-gray-800 text-white rounded"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
