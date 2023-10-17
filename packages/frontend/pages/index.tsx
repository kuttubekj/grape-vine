import { ENV } from "@pushprotocol/uiweb";
import { useAccount, useSignMessage } from 'wagmi'
import { IFeeds, PushAPI } from "@pushprotocol/restapi";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiPaperclip, FiSend } from 'react-icons/fi';  // Import the icons
import { useEthersSigner } from "@/hooks/useEtherSigner";
import moment from "moment";

export const beautifyAddress = (addr: string) =>
  `${addr?.substring(0, 5)}...${addr?.substring(37)}`

export default function Home() {

  const [init, setInit] = useState(false)
  const [user, setUser] = useState<PushAPI>()
  const [chats, setChats] = useState<IFeeds[]>([])
  const [requests, setRequests] = useState<IFeeds[]>([])
  const signer = useEthersSigner()
  // const { data: signer } = useSigner()
  // const { data: signer, isError, isLoading } = useWalletClient()

  // const provider = publicClientToProvider(publicClient);
  // const signer = library?.getSigner(address)
  const initUser = async () => {
    console.log('signer:', signer)
    if (signer) {
      // const message ={
      //   domain: window.location.host,
      //   address,
      //   statement: 'Sign in with Ethereum to the app.',
      //   uri: window.location.origin,
      //   version: '1',
      //   chainId: '5',
      // }
      // const signature = await signMessageAsync({ message: address.toString() });
      // const privKey = keccak256(signature)
      // const signer = new ethers.Wallet(privKey)
      console.log('signer:', signer)
      const _user = await PushAPI.initialize(signer, { env: ENV.DEV })
      setUser(_user)
      setInit(true)

      // const to = '0x4a324370b77f3BeE1eb8479943083637FC9d00f2'
      // const message = await _user.chat.send(to, {
      //   type: 'Text',
      //   content: 'GM',
      // });
      // console.log('message:', message)

      // Create Socket to Listen to incoming messages
      // const pushSDKSocket = createSocketConnection({
      //   user: signer.address,
      //   socketType: 'chat',
      //   socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
      //   env: ENV.DEV,
      // });

      // React to message payload getting received
      // pushSDKSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message: any) => {
      //   console.log('message:', message);
      // });
    }
  }

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
    initUser()
    // fetchChats()
  }, [signer])

  useEffect(() => {
    console.log('user:', user)
    fetchChats()
    fetchRequests()
    // fetchChats()
  }, [user])


  type Message = {
    from: string;
    to: string;
    content: string;
    timestamp: number;
  }
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

  return (
    // <!-- This is an example component -->
    <div className="container mx-auto shadow-lg rounded-lg md:flex md:flex-col">
      {init ? (
        <>
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
            <div className={`flex flex-col w-full md:w-2/5 border-r-2 overflow-y-auto ${selectedChat && 'hidden md:flex'}`}>
              <div className="flex justify-center space-x-4 py-4 border-b-2 tabs tabs-boxed">
                <a
                  className={`tab ${activeTab === 'chats' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('chats')}
                >
                  CHATS
                </a>
                <a 
                  className={`tab ${activeTab === 'requests' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('requests')}
                >
                  REQUESTS
                  <div className="ml-1 badge badge-secondary">{requests.length}</div>
                </a>
              </div>

              {/* Chat List */}
              {activeTab === 'chats' && (
                <>
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
                      <div
                        key={chat.chatId}
                        onClick={() => setSelectedChat(chat?.did?.substring(7) || '')} // use the chat's name or ID
                        className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 hover:bg-primary transition duration-200 cursor-pointer ${chat?.did?.substring(7) === selectedChat ? 'bg-primary text-white' : ''}`}
                      >
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
                    ))}
                    {/* <!-- end user list --> */}
                  </div>
                </>
              )}
              {/* Requests List */}
              {activeTab === 'requests' && (
                <>
                  {/* <!-- search compt --> */}
                  <div className="border-b-2 py-4 px-2">
                    <span>Requests</span>
                  </div>
                  {
                  /* <!-- end search compt -->
                <!-- user list --> */}
                  <div className={`flex flex-col w-full  border-r-2 overflow-y-auto ${selectedChat && 'hidden md:block'}`}>
                    {requests?.map((request, idx) => (
                      <div 
                        key={request.chatId}
                        onClick={() => setSelectedChat(request?.did?.substring(7) || '')}
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
                    ))}
                  </div>
                </>
              )}
            </div>
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
                            className="py-2 px-5 text-white bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-md hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                            type="submit"
                          >
                            Accept
                          </button> 
                          <button
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
        </>
      ) : (
        <span className="loading loading-ring loading-lg content-center"></span>
      )}
    </div>
  );
}
