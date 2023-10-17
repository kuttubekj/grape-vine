import { PushAPI, IFeeds } from "@pushprotocol/restapi";
import { useState, useEffect } from "react";

export const useFeeds = (user: PushAPI | undefined) => {
    const [chats, setChats] = useState<IFeeds[]>([]);
    const [requests, setRequests] = useState<IFeeds[]>([]);
  
    const fetchChats = async () => {
      if (user) {
        const _chats = await user.chat.list("CHATS");
        setChats(_chats);
      }
    };
  
    const fetchRequests = async () => {
      if (user) {
        const _requests = await user.chat.list("REQUESTS");
        setRequests(_requests);
      }
    };
  
    useEffect(() => {
      fetchChats();
      fetchRequests();
    }, [user]);
  
    return { chats, requests, setChats, setRequests };
  };
  