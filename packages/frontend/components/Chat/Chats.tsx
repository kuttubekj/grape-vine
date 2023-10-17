import { IFeeds } from "@pushprotocol/restapi";
import { FC } from "react";
import { ChatItem } from "./ChatItem";

type ChatsProps = {
    chats: IFeeds[];
    selectedChat: string;
    setSelectedChat: (address: string) => void;
};

export const Chats: FC<ChatsProps> = ({ chats, selectedChat, setSelectedChat }) => {
    return (
        <div>
            {/* <!-- search compt --> */}
            <div className="border-b-2 py-4 px-2">
                <input
                    type="text"
                    placeholder="Search address or ENS"
                    className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full bg-white text-black"
                />
            </div>
            {/* <!-- end search compt -->
           <!-- user list --> */}
            <div className={`flex flex-col w-full  border-r-2 overflow-y-auto ${selectedChat && 'hidden md:block'}`}>
                {chats?.map((chat, idx) => (
                    <ChatItem
                        chat={chat}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                        key={chat.chatId}
                    />
                ))}
                {/* <!-- end user list --> */}
            </div>
        </div>
    )
}