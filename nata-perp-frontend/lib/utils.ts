import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenHash(hash: string): string {
  if (hash.length <= 8) return hash;
  return `${hash.slice(0, 4)}...${hash.slice(-4)}`;
}
