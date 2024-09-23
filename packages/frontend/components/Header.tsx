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
    <div className="z-10 max-w-5xl font-mono text-sm grid grid-cols-2 gap-4 items-center">
      <div className="col-span-1">

        <div className="flex items-center pt-2">
          <Image className="w-6 h-6 mr-4 " src="/grape.svg" width="40" height="40" alt="GrapeVine Logo" />
          GrapeVine
        </div>

      </div>
      <div className="col-span-1 from-white via-white dark:from-black dark:via-black  ">
          <ConnectButton
            accountStatus={{
              largeScreen: "full",
              smallScreen: "address",
            }}
            showBalance={false}
          />
        </div>
    </div>
  );
};
