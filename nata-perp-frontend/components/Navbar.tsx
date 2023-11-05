"use client";

import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaBell } from "react-icons/fa";
import Box from "./ui/Box";

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
        <Link href={"/feed"} className={getLinkClasses("/feed")}>
          Feed
        </Link>
      </div>
      <div className="flex flex-row items-center gap-6">
        <Link href={"/notifications"}>
          <Box className="my-auto flex h-12 w-12 items-center justify-center rounded-lg border-white">
            <FaBell className="h-6 w-6 text-white" />
          </Box>
        </Link>
        <w3m-button />
      </div>
    </div>
  );
};

export default Navbar;
