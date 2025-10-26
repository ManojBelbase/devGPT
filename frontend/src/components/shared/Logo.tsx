import { Icon } from '@iconify/react'
import { useAppContext } from '../../context/AppContext';
const Logo = () => {
    const { theme, navigate } = useAppContext();
    return (
        <div className="flex justify-start items-center mb-6">
            <Icon onClick={() => navigate('/')} icon={`hugeicons:developer`} fontSize={40} className={`bg-linear-to-r cursor-pointer p-1 rounded-md from-[#a456f7] to-[#3d81f6] ${theme === "dark" ? "text-white/70" : "text-gray-800"}`}
            />
            <div className="flex flex-col ml-2">
                <p className={` text-xl -mb-1 font-medium ${theme === "dark" ? "text-white" : "text-gray-800"}`}>devGPT</p>
                <span className={`text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>Code smarter with AI</span>
            </div>
        </div>
    )
}

export default Logo
