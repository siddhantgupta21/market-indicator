"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Spinner } from "@/components/ui/spinner";

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface ProcessedOrderBookEntry {
  price: number;
  total: number;
  type: "bid" | "ask";
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

interface MarketDepthProps {
  loading: boolean;
  orderBookData: OrderBookData;
  className?: string;
}

export default function MarketDepth({
  loading,
  orderBookData,
  className = "",
}: MarketDepthProps) {
  const processMarketDepthData = (
    bids: OrderBookEntry[],
    asks: OrderBookEntry[]
  ): ProcessedOrderBookEntry[] => {
    let bidTotal = 0;
    let askTotal = 0;

    const processedBids: ProcessedOrderBookEntry[] = bids
      .sort((a, b) => b.price - a.price)
      .map((bid) => {
        bidTotal += bid.amount;
        return { price: bid.price, total: bidTotal, type: "bid" };
      })
      .reverse();

    const processedAsks: ProcessedOrderBookEntry[] = asks
      .sort((a, b) => a.price - b.price)
      .map((ask) => {
        askTotal += ask.amount;
        return { price: ask.price, total: askTotal, type: "ask" };
      });

    return [...processedBids, ...processedAsks];
  };

  return (
    <Card
      className={`bg-gray-800 border-yellow-500 shadow-lg opacity-95 w-full ${className}`}
    >
      <CardHeader>
        <CardTitle className="text-yellow-500 text-lg sm:text-xl">
          Market Depth
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
              data={processMarketDepthData(
                orderBookData.bids,
                orderBookData.asks
              )}
            >
              <XAxis
                dataKey="price"
                stroke="#22c55e"
                domain={["dataMin", "dataMax"]}
                type="number"
                tickFormatter={(value: number) => value.toFixed(2)}
              />
              <YAxis
                stroke="#22c55e"
                tickFormatter={(value: number) => value.toFixed(2)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #22c55e",
                  color: "#22c55e",
                }}
                itemStyle={{ color: "#FFD700" }}
                formatter={(
                  value: number,
                  name: string,
                  props: { payload: ProcessedOrderBookEntry }
                ) => [
                  value.toFixed(5),
                  props.payload.type === "bid" ? "Bid Total" : "Ask Total",
                ]}
              />
              <Area
                type="stepAfter"
                dataKey="total"
                stroke="#22c55e"
                fill="url(#bidGradient)"
                fillOpacity={0.5}
                name="Bid"
                isAnimationActive={false}
                data={processMarketDepthData(
                  orderBookData.bids,
                  orderBookData.asks
                ).filter((entry) => entry.type === "bid")}
              />
              <Area
                type="stepAfter"
                dataKey="total"
                stroke="#ef4444"
                fill="url(#askGradient)"
                fillOpacity={0.5}
                name="Ask"
                isAnimationActive={false}
                data={processMarketDepthData(
                  orderBookData.bids,
                  orderBookData.asks
                ).filter((entry) => entry.type === "ask")}
              />
              <defs>
                <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
