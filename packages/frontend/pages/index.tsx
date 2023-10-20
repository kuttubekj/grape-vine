import { IFeeds } from "@pushprotocol/restapi";
import { useEffect, useRef, useState } from "react";
import { FiPaperclip, FiSend, FiCodesandbox, FiPlay } from 'react-icons/fi';  // Import the icons
import { useEthersSigner } from "@/hooks/useEtherSigner";
import moment from "moment";
import { usePushAPI } from "@/hooks/push/usePushApi";
import { ChatList } from "@/components/Chat/ChatList";
import { beautifyAddress, isJson } from "@/utils/helpers";
import { useAccount } from "wagmi";
import Blockies from 'react-blockies';
import { LoadingComponent } from "@/components/LoadingComponent";
import { MessageType } from "@pushprotocol/restapi/src/lib/constants";
import { usePayDirect, usePayInvoice, usePaymentRequest } from "@/hooks/usePayment";
import { TransactionModal } from "@/components/Modals/TransactionModal";
import { TokenModal } from "@/components/Modals/TokenModal";
import { parseUnits } from "ethers/lib/utils";
import { MessageItem } from "@/components/Chat/MessageItem";

export enum TransactionType {
  SEND = 'SEND',
  REQUEST = 'REQUEST',
  DIRECT_SEND = 'DIRECT_SEND',
}

export type Message = {
  cid: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  type: MessageType;
  transaction?: {
    type: TransactionType;
    token: string;
    amount: string;
  }
}

export default function Home() {

  const [chats, setChats] = useState<IFeeds[]>([]);
  const [requests, setRequests] = useState<IFeeds[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedChat, setSelectedChat] = useState('');
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'requests'
  const [isTokenModalOpen, setTokenModalOpen] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [chatFetching, setChatFetching] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<Message>();
  const [currentChat, setCurrentChat] = useState<IFeeds>();
  const [invoiceId, setInvoiceID] = useState<string>();
  const [amount, setAmount] = useState<string>();

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const { signer } = useEthersSigner({ address });
  const { user, userInitialized } = usePushAPI(signer);
  const { writeAsync: makePaymentRequest } = usePaymentRequest()
  const { writeAsync: payInvoice } = usePayInvoice()
  const { writeAsync: payDirect } = usePayDirect()

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

  const openTokenModal = () => {
    setTokenModalOpen(true);
  };

  const openTransactionModal = (message: Message, invoiceId: string, amount: string | undefined) => {
    setInvoiceID(invoiceId)
    setAmount(amount)
    setModalVisible(true);
    setTransactionDetails(message)
  };

  const closeTokenModal = () => {
    setTokenModalOpen(false);
  };

  const closeTransactionModal = () => {
    setModalVisible(false);
  };

  const sendMessage = async (to: string, message: any) => {
    if (!user || !to) return;

    console.log('Sending message:', message);
    const sentMessage = await user.chat.send(to, { type: message.type, content: message.content });
    console.log('sentMessage:', sentMessage);

    if (!sentMessage) return;

    const newMessage = {
      cid: sentMessage.cid,
      from: address || '',
      to: to,
      type: message.type,
      content: message.content,
      timestamp: (sentMessage.timestamp || 0) / 1000,
      transaction: message.transaction
    };

    setMessages(prev => [...prev, newMessage]);

    return newMessage;
  };

  const handleSend = async (event: any) => {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    setIsSending(true);

    const message = {
      type: MessageType.TEXT,
      content: trimmedInput
    };

    await sendMessage(selectedChat, message);

    setInput('');
    setIsSending(false);
  };

  const handleTransaction = async (token: string, amount: string, type: TransactionType) => {
    if (!selectedChat || isSending) return;

    setIsSending(true);
    setTransactionLoading(true);

    const transactionData = {
      type: type,
      token,
      amount
    };

    const message = {
      type: MessageType.TEXT,
      content: JSON.stringify(transactionData),
      // info: {
      //   affected: [],
      //   arbitrary: {
      //     type: type,
      //     token,
      //     amount
      //   }
      // }
      transaction: transactionData
    };

    const newMessage = await sendMessage(selectedChat, message);

    if (type === TransactionType.REQUEST) {
      const tx = await makePaymentRequest({ args: [parseUnits(amount, 18), currentChat?.chatId, newMessage?.cid] })
    } else if (type === TransactionType.DIRECT_SEND) {
      const tx = await payDirect({ args: [currentChat?.did?.substring(7), currentChat?.chatId, newMessage?.cid], value: parseUnits(amount, 18) })
    }
    setIsSending(false);
    setTransactionLoading(false);
  };

  const handlePayInvoice = async () => {
    const tx = await payInvoice(
      { args: [invoiceId], value: BigInt(parseUnits(amount, 18) || 0) })
  }

  const fetchChatHistory = async (targetAddress: string) => {
    setMessagesLoading(true)
    if (user) {
      const chatHistory = await user.chat.history(targetAddress);
      console.log('chatHistory:', chatHistory)
      const msgs = chatHistory?.reverse().map((msg: any) => {
        console.log('msg:', msg)
        if (isJson(msg.messageContent)) {
          const messageObj = JSON.parse(msg.messageContent)
          if (
            (messageObj.type == TransactionType.DIRECT_SEND ||
              messageObj.type == TransactionType.REQUEST) &&
            messageObj.token &&
            messageObj.amount
          ) {
            return {
              cid: msg.cid,
              from: msg.fromDID.substring(7),
              to: msg.toDID.substring(7),
              content: messageObj.content,
              timestamp: msg.timestamp / 1000,
              type: msg.messageType,
              transaction: {
                type: messageObj.type,
                token: messageObj.token,
                amount: messageObj.amount,
              }
            }
          }
        }
        return {
          cid: msg.cid,
          from: msg.fromDID.substring(7),
          to: msg.toDID.substring(7),
          content: msg.messageContent,
          timestamp: msg.timestamp / 1000,
          type: msg.messageType
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
          setCurrentChat={setCurrentChat}
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
                  <TransactionModal
                    isOpen={isModalVisible}
                    onClose={closeTransactionModal}
                    message={transactionDetails}
                    onConfirm={handlePayInvoice}
                  />
                  <div className="overflow-y-auto p-5 flex-grow">
                    {
                      messages.map((message, idx) => (
                        <MessageItem
                          key={idx}
                          chatId={currentChat?.chatId}
                          message={message}
                          address={address}
                          openTransactionModal={openTransactionModal}
                        />
                      ))
                    }
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
                          onConfirmSent={handleTransaction}
                          loading={transactionLoading}
                        />
                        <button
                          className="ml-2"
                          type="submit"
                          disabled={isSending || !selectedChat}
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
