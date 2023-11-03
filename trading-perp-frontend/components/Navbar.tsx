"use client";

import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar: FC = ({}) => {
  const pathname = usePathname();

  const getLinkClasses = (href: string) =>
    cn(
      "text-lg font-semibold text-gray-400 hover:text-white transition-colors py-1 box-border",
      pathname === href ? "border-b-2 border-b-white text-white mt-[2px]" : ""
    );

  return (
    <div className="flex w-full items-center justify-between rounded-b-2xl bg-zinc-700/50 px-10 py-6">
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
      <button className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white">
        Connect
      </button>
    </div>
  );
};

export default Navbar;
