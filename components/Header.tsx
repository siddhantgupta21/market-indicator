import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tradingPairs, TradingPair } from "@/constants/trading";

interface HeaderProps {
  selectedPair: TradingPair;
  onPairChange: (value: string) => void;
}

export default function Header({ selectedPair, onPairChange }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
    <div className="text-center sm:text-left">
      <h1 className="text-1xl sm:text-2xl md:text-3xl font-bold text-yellow-500">
        Orderbook and Market Indicators : {selectedPair.name}
      </h1>
      {/* <p className="text-base sm:text-lg md:text-xl text-gray-400">
        Real-time cryptocurrency orderbook and market data
      </p> */}
    </div>
    <Select onValueChange={onPairChange} defaultValue={selectedPair.symbol}>
    <SelectTrigger className="w-full sm:w-[200px] bg-gray-800 text-gray-200 border-yellow-500 px-4 py-3 text-base sm:text-lg rounded-md">
      <SelectValue placeholder="Select trading pair" />
    </SelectTrigger>

      <SelectContent className="bg-gray-800 text-gray-400 border-yellow-500">
        {tradingPairs.map((pair) => (
          <SelectItem
            key={pair.symbol}
            value={pair.symbol}
            className="hover:bg-gray-700"
          >
            {pair.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </header>

  );
}
