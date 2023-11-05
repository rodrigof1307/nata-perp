import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

interface SelectTokenProps {
  onValueChange?: (value: string) => void;
}

export function SelectToken({ onValueChange }: SelectTokenProps) {
  return (
    <Select defaultValue={"bitcoin"} onValueChange={onValueChange}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectTokenItem cryptoId="wrapped-steth" title="ETH/USD" />
          <SelectTokenItem cryptoId="bitcoin" title="BTC/USD" />
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

interface SelectTokenItemProps {
  cryptoId: string;
  title: string;
}

const SelectTokenItem = ({ cryptoId, title }: SelectTokenItemProps) => {
  const fetchCryptoInfo = async ({ queryKey }: any) => {
    const { data } = await axios.get(`/api/getInfo/${queryKey[1]}`);
    return data;
  };

  const { data } = useQuery({
    queryKey: ["cryptoInfo", cryptoId],
    queryFn: fetchCryptoInfo,
    retry: 1,
    cacheTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <SelectItem value={cryptoId}>
      <div className="flex items-center">
        {!data ? (
          <div className="mr-2 h-6 w-6 animate-pulse rounded-full bg-orange-600 p-1" />
        ) : (
          <Image
            src={data.logoUrl}
            alt={title}
            className="mr-2"
            width={24}
            height={24}
          />
        )}
        <p>{title}</p>
      </div>
    </SelectItem>
  );
};
