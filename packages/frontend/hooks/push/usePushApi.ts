import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/uiweb";
import { useState, useEffect, useMemo, useCallback } from "react";

export const usePushAPI = (signer: any) => {
    const [user, setUser] = useState<PushAPI>();
    const [init, setInit] = useState(false);

    const initUser = useCallback(async() => {
        if (signer) {
            const _user = await PushAPI.initialize(signer, { env: ENV.DEV });
            setUser(_user);
            setInit(true);
        }
    }, [signer]);
    
    // const initUser = async () => {
    //   if (signer) {
    //     const _user = await PushAPI.initialize(signer, { env: ENV.DEV });
    //     setUser(_user);
    //     setInit(true);
    //   }
    // };
  
    useEffect(() => {
      initUser();
    }, [signer]);
  
    return { user, userInitialized: init };
  };
  