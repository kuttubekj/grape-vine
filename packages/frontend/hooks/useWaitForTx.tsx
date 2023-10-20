import { Fragment, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { HiExternalLink } from "react-icons/hi"
import { useWaitForTransaction } from "wagmi"

type WaitForTx = {
  successMessage?: string
  errorMessage?: string
  loadingMessage?: string
  onSuccess?: (txHash: string) => void
  onError?: (txHash: string) => void
}

const TRACKING: Record<string, boolean> = {}
const useWaitForTx = ({
  successMessage,
  loadingMessage,
  errorMessage,
  onSuccess,
  onError,
}: WaitForTx = {}) => {

  const [hash, setHash] = useState<string | null>(null);
  const { data, isError, isLoading, isSuccess } = useWaitForTransaction({ hash });

  useEffect(() => {
    if (hash && !TRACKING[hash]) {
      const LOADING_MESSAGE = loadingMessage;
      const ERROR_MESSAGE = errorMessage;
      const SUCESS_MESSAGE = successMessage;

      const toastId = toast.loading(<Fragment>
        <span>{LOADING_MESSAGE || "Loading..."}</span>{" "}
        <Link
          target="_blank"
          className="group gap-1 whitespace-nowrap inline-flex items-center ml-2 text-sm text-rk-blue hover:underline"
          href={`https://goerli.etherscan.io/tx/${hash}`}
        >
          <span>View TX</span>
          <HiExternalLink className="text-base group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </Fragment>);

      console.log('isError, isLoading, data, isSuccess:', isError, isLoading, data, isSuccess);
      // rest of your logic
      // ;(tx?.wait || Promise.resolve)()
      //   .then(({status}) => {
      //     const message = status === 1 ? SUCESS_MESSAGE : 'Transaction Failed'

      //     toast.dismiss(toastId)
      //     if (message) setTimeout(() => status === 1 ? toast.success(message) : toast.error(message), 0)
      //       ; (overrides.onSuccess || onSuccess)?.(hash)
      //   })
      //   .catch((err) => {
      //     if (ERROR_MESSAGE) toast.error(ERROR_MESSAGE)
      //     ;(overrides.onError || onError)?.(hash)
      //   })

    }
  }, [hash, isError, isLoading, data, isSuccess]);

  const waitForTx = useCallback(function (tx: { hash: `0x${string}` }) {
    if (tx && !TRACKING[tx.hash]) {
      setHash(tx.hash);
    }
  }, [])

  return { waitForTx }
}

export default useWaitForTx
