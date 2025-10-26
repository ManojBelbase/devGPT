import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Images } from "../Images";
import { Icon } from "@iconify/react";
import moment from "moment";
import { FronendRoutes } from "../../constant/FrontendRoutes";

const Sidebar = () => {
  const { theme, setSelectedChat, setTheme, user, navigate } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");

  const chats = [
    {
      id: 1,
      name: "AI Assistant",
      updatedAt: "2025-10-26 10:32 AM",
      messages: [
        { role: "user", content: "Hey, how are you today?" },
        { role: "assistant", content: "I'm great! How can I help you?" },
      ],
    },
    {
      id: 2,
      name: "Project Discussion",
      updatedAt: "2025-10-25 04:15 PM",
      messages: [
        { role: "user", content: "Let's plan the new project structure." },
        { role: "assistant", content: "Sure! We can use Next.js for that." },
      ],
    },
    {
      id: 3,
      name: "Travel Chat",
      updatedAt: "2025-10-24 08:45 PM",
      messages: [
        { role: "user", content: "Where should I visit in Nepal?" },
        { role: "assistant", content: "Pokhara and Mustang are great options!" },
      ],
    },
    {
      id: 4,
      name: "Code Help",
      updatedAt: "2025-10-23 01:05 PM",
      messages: [
        { role: "user", content: "Why is my React app not rendering?" },
      ],
    },
    {
      id: 5,
      name: "Empty Chat",
      updatedAt: "2025-10-20 06:00 PM",
      messages: [],
    },
  ];

  const filteredChats = chats.filter((chat) =>
    chat.messages[0]
      ? chat.messages[0].content.toLowerCase().includes(searchTerm.toLowerCase())
      : chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`h-screen flex flex-col px-2 py-4 border-r ${theme === "dark" ? "border-white/10 bg-[#121212]" : "border-gray-200 bg-white"
        }`}
    >
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src={Images.logo}
          alt="Logo"
          className="w-12 h-12 rounded-full object-contain"
        />
      </div>

      {/* New Chat Button */}
      <button
        className="flex items-center justify-center w-full py-2 bg-linear-to-r from-[#a456f7] to-[#3d81f6] text-white text-sm font-medium rounded-md hover:opacity-90 transition"
      >
        <span className="mr-2 text-lg">+</span> New Chat
      </button>

      {/* Search Input */}
      <div
        className={`flex items-center gap-2 mt-5 px-3 py-3 border rounded-md ${theme === "dark"
          ? "border-white/20 bg-white/5"
          : "border-gray-300"
          }`}
      >
        <Icon
          icon="material-symbols:search"
          fontSize={20}
          className={theme === "dark" ? "text-white/70" : "text-gray-600"}
        />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full bg-transparent outline-none text-sm ${theme === "dark"
            ? "text-white placeholder-white/50"
            : "text-gray-800 placeholder-gray-500"
            }`}
        />
        {searchTerm && (
          <Icon
            icon="material-symbols:close"
            fontSize={20}
            onClick={() => setSearchTerm("")}
            className={`cursor-pointer ${theme === "dark" ? "text-white/70" : "text-gray-600"
              }`}
          />
        )}
      </div>

      {/* Chat List */}
      {filteredChats.length > 0 ? (
        <>
          <p className="mt-6 mb-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Recent Chats
          </p>
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-gray-400/40 hover:scrollbar-thumb-gray-400/60">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`flex justify-between items-center border p-3 rounded-md cursor-pointer transition group ${theme === "dark"
                  ? "border-gray hover:border-white/10"
                  : "border-gray-300 hover:border-gray-400"
                  }`}
              >
                <div className="flex flex-col w-full">
                  <p className={`line-clamp-1 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                    {chat.messages.length > 0
                      ? chat.messages[0].content.slice(0, 32)
                      : chat.name}
                  </p>
                  <span className="text-xs text-gray-500">{moment(chat.updatedAt).fromNow()}</span>
                </div>
                <Icon
                  icon="material-symbols:delete-outline"
                  fontSize={20}
                  className={`ml-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100 ${theme === "dark" ? "text-white/70" : "text-gray-600"
                    }`}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-10 text-sm text-gray-500 text-center">
          No chats found
        </p>
      )}

      {/* community images */}
      <div onClick={() => navigate(FronendRoutes.COMMUNITY)} className={`flex items-center gap-2 p-3 mt-4 border border-gray-300 rounded-md dark:border-white/15 cursor-pointer hover:scale-103 transition-all`}>
        <Icon icon={"fluent:people-community-12-filled"} className={`${theme === "dark" ? "text-white" : "text-gray-800"}`} />
        <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-800"}`}> Community Images</span>
      </div>


      {/* Credit Purchase options */}
      <div onClick={() => navigate(FronendRoutes.CREDITS)} className={`flex items-center gap-2 p-3 mt-4 border border-gray-300 rounded-md dark:border-white/15 cursor-pointer hover:scale-101 transition-all`}>
        <Icon icon={"lets-icons:dimond-alt-duotone"} className={`${theme === "dark" ? "text-white" : "text-gray-800"}`} />
        <div className="flxe flex-col text-sm">
          <p className={`${theme === "dark" ? "text-white" : "text-gray-800"}`}>Credits : {user?.credits ? user.credits : 20}</p>
          <span className={`text-xs ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}> Purchase credits to use devGPT</span>
        </div>


      </div>
      {/* dark mode toggle */}

      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-300 rounded-md dark:border-white/15 cursor-pointer hover:scale-101 transition-all justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Icon icon={theme === "dark" ? "mdi:weather-sunny" : "mdi:weather-night"} className={`${theme === "dark" ? "text-white" : "text-gray-800"}`} />
          <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-800"}`}> {theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            checked={theme === "dark" ? true : false}
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all">
            <span className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${theme === "dark" ? "translate-x-4" : ""}`}></span>
          </div>
        </label>
      </div>

      {/* user account */}
      <div className={`flex items-center gap-3 p-3 mt-4 border border-gray-300 rounded-md dark:border-white/15 cursor-pointer hover:scale-101 transition-all`}>
        <Icon icon={"mdi:account-circle"} fontSize={30} className={`${theme === "dark" ? "text-white" : "text-gray-800"}`} />
        <p className="flex-1 text-sm dakr:text-white turncate">{user ? user.name : "Login your account"}</p>
        {user ? <Icon icon={"mdi:logout"} fontSize={20} className={`${theme === "dark" ? "text-white" : "text-gray-800"}`} /> : null}
      </div>
    </div>
  );
};

export default Sidebar;
