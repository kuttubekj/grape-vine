import { beautifyAddress } from "@/utils/helpers";
import { IFeeds } from "@pushprotocol/restapi";
import { FC } from "react";

type RequestItemProps = {
    request: IFeeds;
    selectedChat: string;
    setSelectedChat: (address: string) => void;
    acceptRequest: (address: string) => void;
    rejectRequest: (address: string) => void;
};

export const RequestItem: FC<RequestItemProps> = (
    { request, selectedChat, setSelectedChat, acceptRequest, rejectRequest }) => (
    <div
        onClick={() => setSelectedChat(request?.did?.substring(7) || '')} // OK
        className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 hover:bg-primary transition duration-200 cursor-pointer ${request?.did?.substring(7) === selectedChat ? 'bg-primary text-white' : ''}`}
    >
        <div className="w-1/4">
            <img
                src={request?.profilePicture || ''}
                className="object-cover h-12 w-12 rounded-full"
                alt=""
            />
        </div>
        <div className="w-3/5">
            <div className="text-lg font-semibold">{beautifyAddress(request?.did?.substring(7))}</div>
            <span className={`text-gray-500 ${request?.did?.substring(7) === selectedChat ? 'text-white' : ''}`}>Wants to chat with you</span>
        </div>
        <div className="w-2/5 flex space-x-2">
            <button
                className="text-green-500 border border-green-500 py-1 px-2 rounded"
                onClick={() => acceptRequest(request?.did?.substring(7))}
            >
                Accept
            </button>
            <button
                onClick={() => rejectRequest(request?.did?.substring(7))}
                className="text-red-500 border border-red-500 py-1 px-2 rounded">
                Reject
            </button>
        </div>
    </div>
);
