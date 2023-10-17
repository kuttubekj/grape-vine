import { beautifyAddress } from "@/utils/helpers";
import { IFeeds } from "@pushprotocol/restapi";

export const ChatItem = (
    { chat, selectedChat, setSelectedChat }
        : { chat: IFeeds, selectedChat: string, setSelectedChat: (address: string) => void }) => (
    <div
        onClick={() => setSelectedChat(chat?.did?.substring(7) || '')} // use the chat's name or ID
        className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 hover:bg-primary transition duration-200 cursor-pointer ${chat?.did?.substring(7) === selectedChat ? 'bg-primary text-white' : ''}`}  >
        <div className="w-1/4">
            <img
                src={chat?.profilePicture || ''}
                className="object-cover h-12 w-12 rounded-full"
                alt=""
            />
        </div>
        <div className="w-full">
            <div className="text-lg font-semibold">{beautifyAddress(chat?.did?.substring(7))}</div>
            <span className={`text-gray-500 ${chat?.did?.substring(7) === selectedChat ? 'text-white' : ''}`}>{chat.msg.messageContent}</span>
        </div>
    </div>
);