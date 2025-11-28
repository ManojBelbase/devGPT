import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import { useAppContext } from "../context/AppContext";
import { Icon } from "@iconify/react";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme } = useAppContext();

    const isDark = theme === "dark";

    return (
        <div className={isDark ? "dark bg-gray-950 text-white" : "bg-white text-black"}>
            <div className="flex h-screen overflow-hidden">

                {/* ------- SIDEBAR ------- */}
                <div
                    className={`
                        fixed top-0 left-0 z-50 
                        h-full w-72 
                        transform transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        md:relative md:translate-x-0
                        border-r 
                        ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}
                    `}
                >
                    <Sidebar />
                </div>

                {/* ------- MOBILE OVERLAY ------- */}
                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    />
                )}

                {/* ------- MAIN CONTENT ------- */}
                <div className="flex-1 flex flex-col">


                    {/* Mobile menu toggle */}
                    <button
                        className={`
                            sm:hidden  flex justify-between items-center p-2 m-2 rounded-lg
                            ${isDark ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-gray-100 text-black hover:bg-gray-200"}
                        `}
                        onClick={() => setIsSidebarOpen((prev) => !prev)}
                    ><img src="logo.png" alt="Description" className="rounded-sm h-10 w-10 object-cover" />
                        <Icon icon="material-symbols:menu" fontSize={26} />
                    </button>

                    {/* Page content */}
                    <div className="flex-1 overflow-auto">
                        <Outlet />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Layout;
