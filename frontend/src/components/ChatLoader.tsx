
const ChatLoader = () => {
    return (
        <div>
            <div className="loader flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce">
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce">
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce">
                </div>
            </div>
        </div>
    )
}

export default ChatLoader
