import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trading Perp",
  description: "ETH Lisbon Hackathon Project",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-full">
      <body
        className={cn(
          sora.className,
          "min-h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-zinc-900 to-zinc-800"
        )}
      >
        {children}
      </body>
    </html>
  );
}
