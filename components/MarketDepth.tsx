import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useMemo, useState } from "react";

export interface OrderBookEntry {
  price: number;
  amount: number;
  total?: number;
}

interface ProcessedOrderBookEntry {
  price: number;
  total: number;
  type: "bid" | "ask";
}

export interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

interface MarketDepthProps {
  loading?: boolean;
  orderBookData: OrderBookData;
  className?: string;
  maxDepth?: number;
}

export default function MarketDepth({
  loading = false,
  orderBookData,
  className = "",
  maxDepth = 15,
}: MarketDepthProps) {
  const [midPrice, setMidPrice] = useState<number | null>(null);

  // Process the data on each render
  const processedData = useMemo(() => {
    if (!orderBookData.bids.length || !orderBookData.asks.length) return [];

    // Determine spread and midpoint price
    const highestBid = Math.max(...orderBookData.bids.map((bid) => bid.price));
    const lowestAsk = Math.min(...orderBookData.asks.map((ask) => ask.price));
    const midPoint = (highestBid + lowestAsk) / 2;
    setMidPrice(midPoint);

    // Process bids (buy orders)
    let bidTotal = 0;
    const processedBids: ProcessedOrderBookEntry[] = orderBookData.bids
      .slice(0, maxDepth)
      .sort((a, b) => b.price - a.price)
      .map((bid) => {
        bidTotal += bid.amount;
        return { price: bid.price, total: bidTotal, type: "bid" as const };
      })
      .reverse();

    // Process asks (sell orders)
    let askTotal = 0;
    const processedAsks: ProcessedOrderBookEntry[] = orderBookData.asks
      .slice(0, maxDepth)
      .sort((a, b) => a.price - b.price)
      .map((ask) => {
        askTotal += ask.amount;
        return { price: ask.price, total: askTotal, type: "ask" as const };
      });

    return [...processedBids, ...processedAsks];
  }, [orderBookData, maxDepth]);

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#121212] p-2 border border-[#2A2F3C] rounded shadow-lg">
          <p className="text-[#8E9196]">Price: <span className="text-white">{Number(label).toFixed(2)}</span></p>
          <p className={`${data.type === "bid" ? "text-[#0ecb81]" : "text-[#ea384c]"}`}>
            {data.type === "bid" ? "Bid" : "Ask"} Total: {data.total.toFixed(5)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`bg-[#121212] border-[#2A2F3C] shadow-xl w-full ${className}`}>
      <CardHeader className="pb-2 border-b border-[#2A2F3C]">
        <CardTitle className="text-white text-lg font-medium flex justify-between items-center">
          Market Depth
          {midPrice && (
            <span className="text-sm text-white font-normal">
              Mid Price: <span className="text-white">${midPrice.toFixed(2)}</span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spinner />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={processedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(14, 203, 129, 0.8)" />
                  <stop offset="95%" stopColor="rgba(14, 203, 129, 0)" />
                </linearGradient>
                <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(234, 56, 76, 0.8)" />
                  <stop offset="95%" stopColor="rgba(234, 56, 76, 0)" />
                </linearGradient>
              </defs>
              
              <XAxis
                dataKey="price"
                type="number"
                domain={["dataMin", "dataMax"]}
                tick={{ fill: "#8E9196" }}
                tickLine={{ stroke: "#8E9196" }}
                axisLine={{ stroke: "#2A2F3C" }}
                tickFormatter={(value) => value.toFixed(2)}
              />
              
              <YAxis
                tick={{ fill: "#8E9196" }}
                tickLine={{ stroke: "#8E9196" }}
                axisLine={{ stroke: "#2A2F3C" }}
                tickFormatter={(value) => value.toFixed(2)}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {midPrice && (
                <ReferenceLine
                  x={midPrice}
                  stroke="#9b87f5"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
              )}
              
              <Area
                type="stepAfter"
                dataKey="total"
                stroke="#0ecb81"
                strokeWidth={1.5}
                fill="url(#bidGradient)"
                fillOpacity={0.5}
                name="Bid"
                isAnimationActive={false}
                data={processedData.filter((entry) => entry.type === "bid")}
              />
              
              <Area
                type="stepAfter"
                dataKey="total"
                stroke="#ea384c"
                strokeWidth={1.5}
                fill="url(#askGradient)"
                fillOpacity={0.5}
                name="Ask"
                isAnimationActive={false}
                data={processedData.filter((entry) => entry.type === "ask")}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
