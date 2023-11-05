"use client";

import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SafeButton from "./SafeButton";

const Navbar: FC = ({}) => {
  const pathname = usePathname();

  const getLinkClasses = (href: string) =>
    cn(
      "text-lg font-semibold text-gray-400 hover:text-white transition-colors py-1 box-border",
      pathname === href ? "border-b-2 border-b-white text-white mt-[2px]" : ""
    );

  return (
    <div className="flex h-28 w-full items-center justify-between rounded-b-2xl bg-zinc-600/20 px-10">
      <div className="flex items-center justify-between gap-8">
        <Link href={"/"} className={getLinkClasses("/")}>
          Home
        </Link>
        <Link href={"/trading"} className={getLinkClasses("/trading")}>
          Trading
        </Link>
        <Link
          href={"/liquidity-pool"}
          className={getLinkClasses("/liquidity-pool")}
        >
          Liquidity Pool
        </Link>
        <Link href={"/liquidation"} className={getLinkClasses("/liquidation")}>
          Liquidation
        </Link>
      </div>
      <div className="flex flex-row gap-4">
        <SafeButton />
        {/*<w3m-button />*/}
      </div>
    </div>
  );
};

export default Navbar;
