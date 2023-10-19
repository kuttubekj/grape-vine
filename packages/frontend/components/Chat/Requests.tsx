import { IFeeds, PushAPI } from "@pushprotocol/restapi";
import { FC } from "react";
import { RequestItem } from "./RequestItem";

type RequestsProps = {
    requests: IFeeds[];
    user: PushAPI | undefined;
    selectedChat: string;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    setSelectedChat: (address: string) => void;
    fetchChats: () => void;
    fetchRequests: () => void;
  };
  
export const Requests: FC<RequestsProps> = ({ requests, user, fetchChats, fetchRequests, selectedChat, setSelectedChat }) => {
  
    const acceptRequest = async (address: string) => {
      const acceptedRequest = await user?.chat.accept(address);
      console.log('acceptedRequest:', acceptedRequest)
      fetchChats()
      fetchRequests()
    }
  
    const rejectRequest = async (address: string) => {
      const rejectedRequest = await user?.chat.reject(address);
      console.log('rejectedRequest:', rejectedRequest)
      fetchChats()
      fetchRequests()
    }
  
    return (
      <div className={`flex flex-col w-full border-r-2 overflow-y-auto ${selectedChat && 'hidden md:flex'}`}>
        <div className="border-b-2 py-4 px-2">
          <span>Requests</span>
        </div>
        <div className={`flex flex-col w-full  border-r-2 overflow-y-auto ${selectedChat && 'hidden md:block'}`}>
          {requests?.map((request, idx) => (
            <RequestItem key={idx} request={request} selectedChat={selectedChat} setSelectedChat={setSelectedChat} acceptRequest={acceptRequest} rejectRequest={rejectRequest} />
          ))}
        </div>
      </div>
    )
  }
  