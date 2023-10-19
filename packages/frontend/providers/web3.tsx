/* eslint-disable react/no-children-prop */
import '@rainbow-me/rainbowkit/styles.css';

import {
	// connectorsForWallets,
	RainbowKitProvider,
	lightTheme,
	darkTheme,
	getDefaultWallets
} from '@rainbow-me/rainbowkit';
// import {
// 	injectedWallet,
// 	metaMaskWallet,
// 	trustWallet,
// 	walletConnectWallet,
// 	ledgerWallet,
// 	coinbaseWallet,
// } from '@rainbow-me/rainbowkit/wallets';

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import { ReactNode } from 'react';

import { WALLET_CONNECT_PROJECT_ID } from '@/utils/config';
import { goerli, mainnet } from "wagmi/chains"

interface Props {
	children: ReactNode;
}

const projectId = WALLET_CONNECT_PROJECT_ID;

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[mainnet],
	[publicProvider()]
);


const { connectors } = getDefaultWallets({
	appName: 'Vouch Tech',
	projectId,
	chains
});

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
	webSocketPublicClient,
});


const Web3Provider = (props: Props) => {
	return (
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider
				chains={chains}
				theme={{
					lightMode: lightTheme({ overlayBlur: 'small' }),
					darkMode: darkTheme({ overlayBlur: 'small' }),
				}}
			>
				{props.children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default Web3Provider;