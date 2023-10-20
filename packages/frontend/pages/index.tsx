import Chat from "@/components/Chat";
import { MessageType } from "@pushprotocol/restapi/src/lib/constants";
import { useAccount } from "wagmi";
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(
  () => import('../components/Chat'),
  { ssr: false }
);
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

  return (
    <ClientOnlyComponent />
  )
}
