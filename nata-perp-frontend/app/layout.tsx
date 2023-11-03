import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import WagmiConfig from "@/components/WagmiConfig";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nata Perp",
  description: "ETH Lisbon Hackathon Project",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig>
      <html lang="en" className="min-h-screen">
        <body
          className={cn(
            sora.className,
            "min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-zinc-900 to-zinc-800"
          )}
        >
          <Navbar />
          {children}
        </body>
      </html>
    </WagmiConfig>
  );
}
