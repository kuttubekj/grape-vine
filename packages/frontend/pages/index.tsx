import { IFeeds } from "@pushprotocol/restapi";
import { useEffect, useRef, useState } from "react";
import { FiPaperclip, FiSend, FiCodesandbox } from 'react-icons/fi';  // Import the icons
import { useEthersSigner } from "@/hooks/useEtherSigner";
import moment from "moment";
import { usePushAPI } from "@/hooks/push/usePushApi";
import { ChatList } from "@/components/Chat/ChatList";
import { beautifyAddress } from "@/utils/helpers";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import Blockies from 'react-blockies';
import { LoadingComponent } from "@/components/LoadingComponent";

type Message = {
  from: string;
  to: string;
  content: string;
  timestamp: number;
}

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export default function Home() {

  const [chats, setChats] = useState<IFeeds[]>([])
  const [requests, setRequests] = useState<IFeeds[]>([])
  const { address } = useAccount()
  const { signer } = useEthersSigner({ address })
  const { user, userInitialized } = usePushAPI(signer)
  const [isSending, setIsSending] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [chatFetching, setChatFetching] = useState(false)

  const fetchChats = async () => {
    setChatFetching(true)
    if (user) {
      const _chats = await user.chat.list("CHATS");
      console.log('chats:', _chats)
      setChats(_chats)
    }
    setChatFetching(false)
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
    setChats([])
    setRequests([])
    setMessages([])
    setMessagesLoading(false)
    fetchChats()
    fetchRequests()
  }, [user])

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedChat, setSelectedChat] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'requests'

  const [isTokenModalOpen, setTokenModalOpen] = useState(false);

  const openTokenModal = () => {
    setTokenModalOpen(true);
  };

  const closeTokenModal = () => {
    setTokenModalOpen(false);
  };

  const handleSend = async (event: any) => {
    event.preventDefault();
    setIsSending(true)
    console.log('message:', input)
    if (input.trim() !== '') {
      if (user) {
        console.log('selectedChat:', selectedChat)
        setInput('')
        const sentMessage = await user.chat.send(selectedChat, {
          type: 'Text',
          content: input,
        });
        console.log('sentMessage:', sentMessage)
        setMessages([...messages, { from: address || '', to: selectedChat, content: input, timestamp: (sentMessage?.timestamp || 0) / 1000 }]);
        setIsSending(false)
      }
    }
  };

  const fetchChatHistory = async (targetAddress: string) => {
    setMessagesLoading(true)
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
    setMessagesLoading(false)
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
    <div className="container mx-auto shadow-lg rounded-lg md:flex md:flex-col">
      <div className="px-5 py-5 flex justify-between items-center bg-primary border-b-2">
        <div
          className="h-12 w-12 p-2"
        >
          <Blockies
            seed={address || ''}
            size={10}
            scale={3}
            className="identicon rounded-full"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between bg-gray-900 max-h-screen" style={{
        height: '70vh'
      }}>
        {/* <!-- chat list --> */}
        <ChatList
          chatFetching={chatFetching}
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
        <div className={`w-full md:w-3/5 px-5 flex flex-col max-h-132 ${!selectedChat && 'hidden md:block'}`}        >

          {messagesLoading ? (
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
              {activeTab === 'chats' ? (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="overflow-y-auto p-5 flex-grow">
                    {/* {messagesLoading ? (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh'
                  }}>
                    <LoadingComponent />
                  </div>
                ) : (
                  <> */}
                    {
                      messages.map((message, idx) => (
                        <div key={idx} className={`chat ${message.from === address ? 'chat-end' : 'chat-start'}`}>
                          <div className="chat-image avatar">
                            {/* <div className="w-10 rounded-full">
                          <img
                            src={me}
                            alt="User Avatar"
                          />
                        </div> */}
                          </div>
                          {/* {message.from !== signer?._address && (
                        <div className="chat-header text-white">
                          {beautifyAddress(message.from)}
                        </div>
                      )} */}
                          <div className="chat-bubble">{message.content}</div>
                          <div className="chat-footer opacity-50 text-white">
                            <time className="text-xs opacity-50">{moment.unix(message.timestamp).fromNow()}</time>
                          </div>
                        </div>
                      ))
                    }
                    {/* </>
                )} */}
                    < div ref={endOfMessagesRef} />
                  </div>
                  <div className="border-t pt-2 p-5">
                    <form onSubmit={handleSend}>
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer" onClick={openTokenModal}>
                          <FiCodesandbox className="text-primary h-6 w-6" />
                        </label>

                        <input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          disabled={isSending || !selectedChat}
                          type="text"
                          placeholder={isSending ? 'Message is sending...' : 'Type a message...'}
                          className="flex-grow p-2 input w-full"
                        />
                        {/* <label className="cursor-pointer">
                          <FiPaperclip className="text-primary h-6 w-6" />
                          <input
                            type="file"
                            className="hidden"
                            disabled={isSending}
                          />
                        </label> */}

                        <TokenModal
                          isOpen={isTokenModalOpen}
                          onClose={closeTokenModal}
                          onConfirm={() => { }}
                        />
                        <button
                          className="ml-2"
                          type="submit"
                          disabled={isSending || !selectedChat}
                        >
                          <FiSend className="text-primary h-6 w-6" />
                        </button>
                        {/* <div className="flex items-center space-x-2">
                      <LoadingComponent />
                    </div> */}
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="overflow-y-auto p-5 flex-grow">
                    {messages.map((message, idx) => (
                      <div key={idx} className={`chat ${message.from === address ? 'chat-end' : 'chat-start'}`}>
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA4ElEQVR4AcXBsW2FMBSG0S9XDOAnJrBr7+BRGMViFDfZwztQQ5MWwQZJex+FpegV/zlf9fvnFyeUhnf3Be+aEyOvc8cLpeHdfcEzxAwxQ2y65sSbvuOF0vCujaFQGt7dF7xrTniGmCFmiE0xV7y7MxRz5RMxVzxDzBAzxCYeQmmMHNvKSMwVL5TGiCFmiBlihpghZogZYhMPx7bivc6dN/PKyN0XvGtOeDFXPEPMEDPEJh5irnjHlviPa054MVdGDDFDzBCbeDi2Fe917nihNEbuvuAdW8KLueIZYoaYIfYHGS41ybbN0E4AAAAASUVORK5CYII="
                              alt="User Avatar"
                            />
                          </div>
                        </div>
                        {message.from !== address && (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TokenModal(
  { isOpen, onClose, onConfirm }:
    { isOpen: boolean, onClose: () => void, onConfirm: (token: string, amount: string) => void }
) {
  const [chosenToken, setChosenToken] = useState('ETH');
  const [tokenAmount, setTokenAmount] = useState('');

  return (
    <div className={`fixed z-50 top-0 left-0 w-full h-full ${isOpen ? 'block' : 'hidden'}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-5 bg-white rounded-lg">
        <h3 className="text-center mb-4">Send Token</h3>

        <select
          onChange={(e) => setChosenToken(e.target.value)}
          className="input w-full mb-4"
        >
          <option value="ETH">ETH</option>
          <option value="DAI">DAI</option>
          <option value="USDT">USDT</option>
          {/* Add other tokens as necessary */}
        </select>

        <input
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
          type="number"
          placeholder="Amount"
          className="input w-full mb-4"
        />

        <div className="flex justify-between">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onConfirm(chosenToken, tokenAmount)}>Send</button>
        </div>
      </div>
    </div>
  );
}