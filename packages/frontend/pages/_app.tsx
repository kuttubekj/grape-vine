import '@/styles/globals.css'
import 'font-awesome/css/font-awesome.min.css';
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Web3Provider from '@/providers/web3';
import Layout from '@/components/Layout';
import { Toaster } from 'react-hot-toast';
// import { ChatUIProvider, ENV } from '@pushprotocol/uiweb';
// import { darkChatTheme } from "@pushprotocol/uiweb";


declare global {
  interface Window {
    Web3Provider: any;
    ethereum: any;
  }
}

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Toaster
        position="top-right"
        containerClassName="mt-14 md:mt-16 lg:mt-24 max-w-screen-md mx-auto"
        toastOptions={{
          className: "!rounded-full select-none",
        }}
      />

      <Web3Provider>
        {/* <ChatUIProvider theme={darkChatTheme} env={ENV.DEV}> */}
        {/* <main
          // className={`flex min-h-screen flex-col items-center justify-between p-12 ${inter.className}`}
          className={`flex min-h-screen flex-col items-center justify-between p-12 ${inter.className}`}
        > */}
        <main className={`p-12 ${inter.className}`}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </main>
        {/* </ChatUIProvider> */}
      </Web3Provider>
    </main>

  )
}
