import Chat from "@/components/Chat";
import { MessageType } from "@pushprotocol/restapi/src/lib/constants";
import { useAccount } from "wagmi";
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(
  () => import('../components/Chat'),
  { ssr: false }
);
export default function Home() {

  return (
    <ClientOnlyComponent />
  )
}
