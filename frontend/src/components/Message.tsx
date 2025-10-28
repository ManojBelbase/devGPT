import { Icon } from "@iconify/react"
import { useEffect } from "react"
import Markdown from "react-markdown"
import Prism from "prismjs"
import moment from "moment"

const Message = ({ message }: any) => {

    useEffect(() => {
        Prism.highlightAll()

    }, [message?.content])
    return (
        <div>
            {message?.role === "user" ? (
                <div className="flex items-start justify-end my-3 gap-3 px-4">
                    <div className="flex flex-col gap-2 py-2 px-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg max-w-2xl shadow-sm">
                        <p className="text-sm leading-relaxed">{message?.content}</p>
                        <span className="text-xs text-blue-100 dark:text-blue-200">{message?.timestamp}</span>
                    </div>
                    <Icon
                        icon="material-symbols:person-outline"
                        fontSize={24}
                        className="text-gray-500 dark:text-gray-400 mt-1 "
                    />
                </div>
            ) : (
                <div className="flex items-start gap-3 my-2 px-4">

                    <Icon
                        icon="material-symbols:smart-toy-outline"
                        fontSize={24}
                        className="text-gray-600 dark:text-gray-400 mt-1"
                    />
                    <div className="flex flex-col gap-2 py-1 px-4 max-w-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm">
                        {message?.isImage ? (
                            <img
                                src={message?.content}
                                alt="AI generated"
                                className="max-w-md rounded-md shadow-sm"
                            />
                        ) : <div className="text-sm leading-relaxed reset-tw">
                            <Markdown>{message?.content}</Markdown>
                        </div>}

                        <span className="text-xs text-gray-500 dark:text-gray-400">{moment(message?.timestamp).fromNow()}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Message
