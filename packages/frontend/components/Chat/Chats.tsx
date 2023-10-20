import { IFeeds } from "@pushprotocol/restapi";
import { FC, useEffect, useState } from "react";
import { ChatItem } from "./ChatItem";
import { LoadingComponent } from "../LoadingComponent";
import { isAddress } from "viem";
import { fetchEnsAddress } from "wagmi/actions";

type ChatsProps = {
    loading: boolean,
    chats: IFeeds[];
    selectedChat: string;
    setSelectedChat: (address: string) => void;
    setCurrentChat: (chat: IFeeds) => void;
};

export const Chats: FC<ChatsProps> = ({ chats, selectedChat, setSelectedChat, loading, setCurrentChat }) => {
    const [searchAddress, setSearchAddress] = useState('');

    const handleSearch = async (term: string) => {
        if (!term) {
            setSearchAddress('');
            return;
        }

        if (isAddress(term)) {
            setSearchAddress(term);
            return;
        } else {
            try {
                const ensAddress = await fetchEnsAddress({ name: term })
                if(ensAddress) {
                    setSearchAddress(ensAddress || '');
                }
                // setEnsName(term);
            } catch (err) {
                console.log(err)
                setSearchAddress('');
            }
        }
    };

    return (
        <div>
            <div className="border-b-2 py-4 px-2">
                <input
                    type="text"
                    placeholder="Search address or ENS"
                    className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full bg-white text-black"
                    onChange={(e) => {
                        handleSearch(e.target.value);
                    }}
                />
                {searchAddress.length > 0 && (
                    <div className="absolute mt-2 bg-white border rounded shadow">
                        <div
                            className="py-2 px-4 hover:bg-gray-200 cursor-pointer text-primary"
                            onClick={() => {
                                setSelectedChat(searchAddress);
                                setSearchAddress('');
                            }}
                        >
                            {searchAddress}
                        </div>
                    </div>
                )}
            </div>
            <div className={`flex flex-col w-full  border-r-2 overflow-y-auto ${selectedChat && 'hidden md:block'}`}>
                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh'
                    }}>
                        <LoadingComponent />
                    </div>
                ) : (
                    <>
                        {chats?.length === 0 ? (
                            <span
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '50vh'
                                }}
                            >Start a new chat</span>
                        ) : (
                            <>
                                {chats?.map((chat, idx) => (
                                    <ChatItem
                                        chat={chat}
                                        selectedChat={selectedChat}
                                        setSelectedChat={setSelectedChat}
                                        setCurrentChat={setCurrentChat}
                                        key={chat.chatId}
                                    />
                                ))}
                            </>)
                        }
                    </>
                )}
            </div>
        </div>
    )
}