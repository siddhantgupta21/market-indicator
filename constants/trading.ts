export interface TradingPair {
  symbol: string;
  name: string;
}

export const tradingPairs: TradingPair[] = [
  { symbol: "BTCUSDT", name: "BTC-USD" },
  { symbol: "ETHUSDT", name: "ETH-USD" },
  { symbol: "XRPUSDT", name: "XRP-USD" },
];
