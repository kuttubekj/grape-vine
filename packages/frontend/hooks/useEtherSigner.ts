import { Signer, providers } from "ethers"
import { useEffect, useMemo, useState } from "react"
import { WalletClient, useWalletClient } from "wagmi"

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export const useEthersSigner = ({ address, chainId }: { address: `0x${string}` | undefined, chainId?: number }) => {
    const [signer, setSigner] = useState<Signer>()
    const { data: walletClient } = useWalletClient({ chainId })

    useEffect(() => {
        if (walletClient) {
            setSigner(walletClientToSigner(walletClient))
        }
    }, [walletClient, address])

    return { signer }
    // return useMemo(
    //     () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    //     [walletClient],
    // )
}

const walletClientToSigner = (walletClient: WalletClient): Signer => {
    const { account, chain, transport } = walletClient
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new providers.Web3Provider(transport, network)
    const signer = provider.getSigner(account.address)
    return signer
}
