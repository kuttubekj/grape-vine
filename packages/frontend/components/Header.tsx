import React, { useCallback,  useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { Bars3Icon, BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
// import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
// import { useOutsideClick } from "~~/hooks/scaffold-eth";

// const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
//   const router = useRouter();
//   const isActive = router.pathname === href;

//   return (
//     <Link
//       href={href}
//       passHref
//       className={`${
//         isActive ? "bg-secondary shadow-md" : ""
//       } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
//     >
//       {children}
//     </Link>
//   );
// };

/**
 * Site header
 */
export const Header = () => {
  return (
    // <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2 border-b font-header">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Friend Tech
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <ConnectButton
            accountStatus={{
              largeScreen: "full",
              smallScreen: "address",
            }}
            showBalance={false}
          />
        </div>
      {/* </div> */}

    </div>
  );
};
