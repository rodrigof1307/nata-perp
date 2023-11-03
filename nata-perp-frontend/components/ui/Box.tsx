import { cn } from "@/lib/utils";
import { FC } from "react";

interface BoxProps {
  className?: string;
  children: React.ReactNode;
}

const Box: FC<BoxProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-md border-2 border-orange-600 bg-zinc-600/20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Box;
