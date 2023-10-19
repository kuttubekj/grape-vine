import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/uiweb";
import { useState, useEffect, useMemo, useCallback, use } from "react";

export const usePushAPI = (signer: any) => {
  const [user, setUser] = useState<PushAPI>();
  const [init, setInit] = useState(false);

  // const initUser = async () => {
  //   if (signer) {
  //     const _user = await PushAPI.initialize(signer, { env: ENV.DEV });
  //     setUser(_user);
  //     setInit(true);
  //   }
  // };

  useEffect(() => {
    console.log('signer in use push api:', signer)
    const initUser = async () => {
      if (signer) {
        const _user = await PushAPI.initialize(signer, { env: ENV.PROD });
        setUser(_user);
        setInit(true);
      }
    };

    initUser();
  }, [signer]);

  return { user, userInitialized: init };
};
