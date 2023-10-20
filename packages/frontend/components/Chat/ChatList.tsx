import { IFeeds, PushAPI } from "@pushprotocol/restapi";
import { FC } from "react";
import { Chats } from "./Chats";
import { Requests } from "./Requests";

type ChatListProps = {
    chatFetching: boolean;
    chats: IFeeds[];
    requests: IFeeds[];
    user: PushAPI | undefined;
    selectedChat: string;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    setSelectedChat: (address: string) => void;
    fetchChats: () => void;
    fetchRequests: () => void;
    setCurrentChat: (chat: IFeeds) => void;
};

export const ChatList: FC<ChatListProps> = ({
    chatFetching,
    activeTab,
    setActiveTab,
    selectedChat,
    setSelectedChat,
    chats,
    requests,
    user,
    fetchChats,
    fetchRequests,
    setCurrentChat
}) => {
    const handleToggle = (tab: string) => {
        setSelectedChat('')
        setActiveTab(tab);
    }
    return (
        <div className={`flex flex-col w-full md:w-2/5 border-r-2 overflow-y-auto ${selectedChat && 'hidden md:flex'}`}>
            <div className="flex items-center justify-center space-x-4 py-4 border-b-2 tabs tabs-boxed">
                <a
                    className={`tab ${activeTab === 'chats' ? 'tab-active' : ''}`}
                    onClick={() => handleToggle('chats')}
                >
                    CHATS
                </a>
                <a
                    className={`tab ${activeTab === 'requests' ? 'tab-active' : ''}`}
                    onClick={() => handleToggle('requests')}
                >
                    REQUESTS
                    <div className="ml-1 badge badge-secondary">{requests.length}</div>
                </a>
            </div>
            {
                activeTab === 'chats'
                    ? <Chats
                        loading={chatFetching}
                        chats={chats}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                        setCurrentChat={setCurrentChat}
                    />
                    : <Requests
                        requests={requests}
                        selectedChat={selectedChat}
                        user={user}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setSelectedChat={setSelectedChat}
                        fetchChats={fetchChats}
                        fetchRequests={fetchRequests}
                    />
            }
        </div>
    )
};
