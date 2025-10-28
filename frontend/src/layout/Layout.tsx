"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/shared/Sidebar"
import { useAppContext } from "../context/AppContext"
import { Icon } from "@iconify/react"

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { theme } = useAppContext()

    return (
        <div className={theme === "dark" ? "dark bg-gray-950 text-white" : "bg-white text-black"}>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div
                    className={`
                        fixed md:relative z-50
                        h-full border-r transition-colors
                        w-72
                        transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        transition-transform duration-300 ease-in-out
                        md:translate-x-0
                        ${theme === "dark" ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}
                    `}
                >
                    <Sidebar />
                </div>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
                )}

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Mobile toggle button */}
                    <button
                        className={`md:hidden p-3 m-2 rounded-lg transition-colors ${theme === "dark" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-black hover:bg-gray-200"
                            }`}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Icon icon="material-symbols:menu" fontSize={24} />
                    </button>

                    {/* Chat area - Changed from overflow-auto to overflow-hidden to let ChatBox manage scrolling */}
                    <div className="flex-1 overflow-hidden">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout
