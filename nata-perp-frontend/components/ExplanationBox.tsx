import { FC } from "react";
import Box from "./ui/Box";
import { Button } from "./ui/button";
import Link from "next/link";

interface ExplanationBoxProps {
  title: string;
  description: string;
  buttonTitle: string;
  href: string;
}

const ExplanationBox: FC<ExplanationBoxProps> = ({
  title,
  description,
  buttonTitle,
  href,
}) => {
  return (
    <Box className="flex h-[65vh] w-[28%] flex-col justify-between rounded-2xl py-6 text-center">
      <div>
        <h1 className="mb-4 text-3xl font-semibold text-white">{title}</h1>
        <p className="text-lg font-light text-white">{description}</p>
      </div>
      <Link href={href}>
        <button className="w-4/5 rounded-xl">
          <Box className="py-2 text-lg font-semibold text-white">
            {buttonTitle}
          </Box>
        </button>
      </Link>
    </Box>
  );
};

export default ExplanationBox;
