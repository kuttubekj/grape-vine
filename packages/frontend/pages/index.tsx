import { IFeeds } from "@pushprotocol/restapi";
import { useEffect, useRef, useState } from "react";
import { FiPaperclip, FiSend } from 'react-icons/fi';  // Import the icons
import { useEthersSigner } from "@/hooks/useEtherSigner";
import moment from "moment";
import { usePushAPI } from "@/hooks/push/usePushApi";
import { ChatList } from "@/components/Chat/ChatList";
import { beautifyAddress } from "@/utils/helpers";


type Message = {
  from: string;
  to: string;
  content: string;
  timestamp: number;
}

export default function Home() {

  const [chats, setChats] = useState<IFeeds[]>([])
  const [requests, setRequests] = useState<IFeeds[]>([])
  const signer = useEthersSigner()
  const { user, userInitialized } = usePushAPI(signer)

  const fetchChats = async () => {
    if (user) {
      const _chats = await user.chat.list("CHATS");
      console.log('chats:', _chats)
      setChats(_chats)
    }
  }

  const fetchRequests = async () => {
    if (user) {
      const _requests = await user.chat.list("REQUESTS");
      console.log('_requests:', _requests)
      setRequests(_requests)
    }
  }

  useEffect(() => {
    console.log('user:', user)
    fetchChats()
    fetchRequests()
    // fetchChats()
  }, [user])

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedChat, setSelectedChat] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'requests'

  const handleSend = (event: any) => {
    event.preventDefault();
    console.log('aa:', input)
    if (input.trim() !== '') {
      // setMessages([...messages, { sender: '0xa2...10af', content: input }]);
      setInput('');
    }
  };

  const fetchChatHistory = async (targetAddress: string) => {
    if (user) {
      const chatHistory = await user.chat.history(targetAddress);
      console.log('chatHistory:', chatHistory)
      const msgs = chatHistory?.reverse().map((msg: any) => {
        return {
          from: msg.fromDID.substring(7),
          to: msg.toDID.substring(7),
          content: msg.messageContent,
          timestamp: msg.timestamp / 1000
        }
      })
      console.log('msgs:', msgs)
      setMessages(msgs);
    }
  }

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

  useEffect(() => {
    if (endOfMessagesRef.current) {
      const element = endOfMessagesRef.current;
      if (element.parentElement) {
        element.parentElement.scrollTop = element.offsetTop;
      }
    }
  }, [messages]);

  useEffect(() => {
    console.log('selectedChat:', selectedChat)
    fetchChatHistory(selectedChat);
  }, [selectedChat]);

  if (!userInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}>
        <LoadingComponent />
      </div>
    );
  }

  return (
    // <!-- This is an example component -->
    <div className="container mx-auto shadow-lg rounded-lg md:flex md:flex-col">
      {/* <!-- headaer --> */}
      <div className="px-5 py-5 flex justify-between items-center bg-primary border-b-2">
        {/* <div className="font-semibold text-2xl">GoingChat</div> */}
        {/* <div className="w-1/2">
          <input
            type="text"
            placeholder="search IRL"
            className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
          />
        </div> */}
        <div
          className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center"
        >
          K
        </div>
      </div>
      {/* <!-- end header -->
          <!-- Chatting --> */}
      <div className="flex flex-col md:flex-row justify-between bg-gray-900 max-h-screen">
        {/* <!-- chat list --> */}
        <ChatList 
          chats={chats}
          requests={requests}
          user={user}
          fetchChats={fetchChats}
          fetchRequests={fetchRequests}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
        {/* <!-- end chat list -->
             <!-- message --> */}
        <div className={`w-full md:w-3/5 px-5 flex flex-col max-h-132 ${!selectedChat && 'hidden md:block'}`}>

          {activeTab === 'chats' ? (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="overflow-y-auto p-5 flex-grow">
                {messages.map((message, idx) => (
                  <div key={idx} className={`chat ${message.from === signer?._address ? 'chat-end' : 'chat-start'}`}>
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA4ElEQVR4AcXBsW2FMBSG0S9XDOAnJrBr7+BRGMViFDfZwztQQ5MWwQZJex+FpegV/zlf9fvnFyeUhnf3Be+aEyOvc8cLpeHdfcEzxAwxQ2y65sSbvuOF0vCujaFQGt7dF7xrTniGmCFmiE0xV7y7MxRz5RMxVzxDzBAzxCYeQmmMHNvKSMwVL5TGiCFmiBlihpghZogZYhMPx7bivc6dN/PKyN0XvGtOeDFXPEPMEDPEJh5irnjHlviPa054MVdGDDFDzBCbeDi2Fe917nihNEbuvuAdW8KLueIZYoaYIfYHGS41ybbN0E4AAAAASUVORK5CYII="
                          alt="User Avatar"
                        />
                      </div>
                    </div>
                    {message.from !== signer?._address && (
                      <div className="chat-header text-white">
                        {beautifyAddress(message.from)}
                      </div>
                    )}
                    <div className="chat-bubble">{message.content}</div>
                    <div className="chat-footer opacity-50 text-white">
                      <time className="text-xs opacity-50">{moment.unix(message.timestamp).fromNow()}</time>
                    </div>
                  </div>
                ))}
                <div ref={endOfMessagesRef} />

              </div>
              <div className="border-t pt-2 p-5">
                <form onSubmit={handleSend}>
                  <div className="flex items-center space-x-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      type="text"
                      placeholder="Type a message..."
                      className="flex-grow p-2 input w-full"
                    />
                    <label className="cursor-pointer">
                      <FiPaperclip className="text-primary h-6 w-6" />
                      <input
                        type="file"
                        className="hidden"
                      />
                    </label>
                    <button
                      className="ml-2"
                      type="submit"
                    >
                      <FiSend className="text-primary h-6 w-6" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="overflow-y-auto p-5 flex-grow">
                {messages.map((message, idx) => (
                  <div key={idx} className={`chat ${message.from === signer?._address ? 'chat-end' : 'chat-start'}`}>
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA4ElEQVR4AcXBsW2FMBSG0S9XDOAnJrBr7+BRGMViFDfZwztQQ5MWwQZJex+FpegV/zlf9fvnFyeUhnf3Be+aEyOvc8cLpeHdfcEzxAwxQ2y65sSbvuOF0vCujaFQGt7dF7xrTniGmCFmiE0xV7y7MxRz5RMxVzxDzBAzxCYeQmmMHNvKSMwVL5TGiCFmiBlihpghZogZYhMPx7bivc6dN/PKyN0XvGtOeDFXPEPMEDPEJh5irnjHlviPa054MVdGDDFDzBCbeDi2Fe917nihNEbuvuAdW8KLueIZYoaYIfYHGS41ybbN0E4AAAAASUVORK5CYII="
                          alt="User Avatar"
                        />
                      </div>
                    </div>
                    {message.from !== signer?._address && (
                      <div className="chat-header text-white">
                        {beautifyAddress(message.from)}
                      </div>
                    )}
                    <div className="chat-bubble">{message.content}</div>
                    <div className="chat-footer opacity-50 text-white">
                      <time className="text-xs opacity-50">{moment.unix(message.timestamp).fromNow()}</time>
                    </div>
                  </div>
                ))}
                <div ref={endOfMessagesRef} />

              </div>
              <div className="border-t pt-2 p-5">
                <form onSubmit={handleSend}>
                  <div className="w-full flex justify-end space-x-4">
                    <button
                      onClick={() => acceptRequest(selectedChat)}
                      className="py-2 px-5 text-white bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-md hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                      type="submit"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectRequest(selectedChat)}
                      className="py-2 px-5 text-white bg-gradient-to-r from-red-400 to-red-600 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                      type="submit"
                    >
                      Reject
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const LoadingComponent = () => (
  <span className="loading loading-ring loading-lg content-center"></span>
);

