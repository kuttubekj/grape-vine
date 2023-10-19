import { beautifyAddress } from "@/utils/helpers";
import { IFeeds } from "@pushprotocol/restapi";
import { useMemo } from "react";

export const ChatItem = (
    { chat, selectedChat, setSelectedChat }
        : { chat: IFeeds, selectedChat: string, setSelectedChat: (address: string) => void }) => {
    
    const groupInfo = useMemo(() => {
        return chat.groupInformation
    }, [chat])
    const chatName = useMemo(() => groupInfo?.groupName || beautifyAddress(chat?.did?.substring(7)), [chat])
    const profileImage = useMemo(() => groupInfo?.groupImage || chat?.profilePicture, [chat])

    return (
        <div
            onClick={() => setSelectedChat(chat?.did?.substring(7) || '')} // use the chat's name or ID
            className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 hover:bg-primary transition duration-200 cursor-pointer ${chat?.did?.substring(7) === selectedChat ? 'bg-primary text-white' : ''}`}  >
            <div className="w-1/4">
                <img
                    src={profileImage || ''}
                    className="object-cover h-12 w-12 rounded-full"
                    alt=""
                />
            </div>
            <div className="w-full">
                <div className="text-lg font-semibold">{chatName}</div>
                <span className={`text-gray-500 ${chat?.did?.substring(7) === selectedChat ? 'text-white' : ''}`}>{chat.msg.messageContent}</span>
            </div>
        </div>
    )
};