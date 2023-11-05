import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nata Perp Dex",
  description: "ETH Lisbon Hackathon Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
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
    </Providers>
  );
}
