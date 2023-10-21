import { beautifyAddress, isJson } from "@/utils/helpers";
import { IFeeds, chat } from "@pushprotocol/restapi";
import { useMemo } from "react";
import { TransactionType } from ".";

export const ChatItem = (
    { chat, selectedChat, setSelectedChat, setCurrentChat }
        : { 
            chat: IFeeds,
            selectedChat: string, 
            setSelectedChat: (address: string) => void, 
            setCurrentChat: (chat: IFeeds) => void
        }) => {

    let isRequest = false
    let isPayment = false
    
    console.log('ChatItem: chat.msg:', chat.msg)
    if (isJson(chat.msg.messageContent)) {
        const message = JSON.parse(chat.msg.messageContent)
        isRequest = message?.type === TransactionType.REQUEST
        isPayment = message?.type === TransactionType.DIRECT_SEND
    }
    

    const groupInfo = useMemo(() => chat?.groupInformation, [chat])
    const chatName = useMemo(() => groupInfo?.groupName || beautifyAddress(chat?.did?.substring(7)), [chat])
    const profileImage = useMemo(() => groupInfo?.groupImage || chat?.profilePicture, [chat])
    const handleSelect = () => {
        setCurrentChat(chat)
        setSelectedChat(chat?.did?.substring(7) || '')
    }

    return (
        <div
            onClick={handleSelect}
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
                <span className={`text-gray-500 ${chat?.did?.substring(7) === selectedChat ? 'text-white' : ''}`}>
                    {isRequest ? '💰 Requested' : isPayment ? '💰 Payment' : chat.msg.messageContent}
                </span>
            </div>
        </div>
    )
};