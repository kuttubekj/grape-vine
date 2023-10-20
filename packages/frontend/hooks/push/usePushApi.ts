import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/uiweb";
import { useState, useEffect, useMemo, useCallback, use } from "react";

export const usePushAPI = (signer: any) => {
  const [user, setUser] = useState<PushAPI>();
  const [init, setInit] = useState(false);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    const initUser = async () => {
      if (signer) {
        const address = await signer.getAddress()
        if (userAddress !== address) {
          const _user = await PushAPI.initialize(signer, { env: ENV.PROD });
          setUser(_user);
          setUserAddress(address)
          setInit(true);
        }
      }
    };

    initUser();
  }, [signer]);

  return { user, userInitialized: init };
};
