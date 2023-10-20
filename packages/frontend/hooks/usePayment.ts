import { abi } from "@/constants/abi/payment"
import { useContractRead, useContractWrite } from "wagmi"

const CONTRACT_ADDRESS = "0x535221725c9316f2AF5A49c55417e604248c0C44"

export const usePaymentRequest = () => {
    return useContractWrite({
        abi: abi,
        address: CONTRACT_ADDRESS,
        functionName: "makePaymentRequest",
    })
}

export const usePayInvoice = () => {
    return useContractWrite({
        abi: abi,
        address: CONTRACT_ADDRESS,
        functionName: "payInvoice",
    })
}

export const usePayDirect = () => {
    return useContractWrite({
        abi: abi,
        address: CONTRACT_ADDRESS,
        functionName: "payDirect",
    })
}

export const useInvoice = (invoiceId: string) => {
    const { data: invoice, isLoading } = useContractRead<
      any,
      any,
      string
    >({
      cacheTime: 15_000,
      scopeKey: `invoices.${invoiceId}`,
      watch: true,
      enabled: Boolean(invoiceId),
      abi: abi,
      address: CONTRACT_ADDRESS,
      functionName: "invoices",
        args: [invoiceId],
    })

    return {
        isPaid: invoice?.[2],
        isLoading
    }
}  