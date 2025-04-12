"use client";

import { useState, useEffect } from "react";
import GridLineBackground from "@/components/GridLineBackground";
import Header from "@/components/Header";
import SpreadIndicator from "@/components/SpreadIndicator";
import OrderbookImbalance from "@/components/OrderbookImbalance";
import MarketDepth from "@/components/MarketDepth";
import OrderBook from "@/components/OrderBook";
import { tradingPairs, TradingPair } from "@/constants/trading";


interface OrderBookEntry {
  price: number;
  amount: number;
  total?: number; 
  change?: number; 
}


interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

interface SpreadHistoryEntry {
  time: number;
  spread: number;
}

export default function Home() {
  const [orderBookData, setOrderBookData] = useState<OrderBookData>({
    bids: [],
    asks: [],
  });
  const [spreadHistory, setSpreadHistory] = useState<SpreadHistoryEntry[]>([]);
  const [imbalance, setImbalance] = useState<number>(0);
  const [selectedPair, setSelectedPair] = useState<TradingPair>(
    tradingPairs[0]
  );
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (ws) {
      ws.close();
    }

    const newWs = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedPair.symbol.toLowerCase()}@depth20@100ms`
    );
    setWs(newWs);

    newWs.onopen = () => setLoading(false);

    newWs.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        const processPriceLevel = (
          level: [string, string] | { price: string; amount: string }
        ): { price: number; amount: number } => {
          if (Array.isArray(level)) {
            return {
              price: parseFloat(level[0]),
              amount: parseFloat(level[1]),
            };
          }
          return {
            price: parseFloat(level.price),
            amount: parseFloat(level.amount),
          };
        };

        const processOrders = (
          orders: [string, string][] | Record<string, string>
        ): { price: number; amount: number }[] => {
          if (Array.isArray(orders)) {
            return orders.map(processPriceLevel);
          }
          return Object.entries(orders).map(([price, amount]) => ({
            price: parseFloat(price),
            amount: parseFloat(amount),
          }));
        };

        const bids = processOrders(data.bids || []);
        const asks = processOrders(data.asks || []);

        setOrderBookData((prevData) => {
          const newBids = bids.slice(0, 10).map((bid, index) => ({
            ...bid,
            total: bids
              .slice(0, index + 1)
              .reduce((sum, b) => sum + b.amount, 0),
            change: prevData.bids[index]
              ? bid.amount - prevData.bids[index].amount
              : 0,
          }));

          const newAsks = asks.slice(0, 10).map((ask, index) => ({
            ...ask,
            total: asks
              .slice(0, index + 1)
              .reduce((sum, a) => sum + a.amount, 0),
            change: prevData.asks[index]
              ? ask.amount - prevData.asks[index].amount
              : 0,
          }));

          return { bids: newBids, asks: newAsks };
        });

        const bestBid = bids.length > 0 ? bids[0].price : 0;
        const bestAsk = asks.length > 0 ? asks[0].price : 0;
        const spread = bestAsk - bestBid;

        setSpreadHistory((prev) => [
          ...prev.slice(-59),
          { time: Date.now(), spread },
        ]);

        const bidVolume = bids.reduce((sum, bid) => sum + bid.amount, 0);
        const askVolume = asks.reduce((sum, ask) => sum + ask.amount, 0);
        setImbalance((bidVolume - askVolume) / (bidVolume + askVolume));
      } catch (error) {
        console.error("Error processing WebSocket data:", error);
      }
    };

    return () => {
      if (newWs) {
        newWs.close();
      }
    };
  }, [selectedPair]);

  const handlePairChange = (value: string) => {
    const newPair = tradingPairs.find((pair) => pair.symbol === value);
    if (newPair) {
      setSelectedPair(newPair);
      setLoading(true);
    }
  };

  return (
      <div className="min-h-screen">
        <GridLineBackground>
        <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <Header selectedPair={selectedPair} onPairChange={handlePairChange} />
          <div className="grid grid-cols-1 gap-8">
            <OrderBook loading={loading} orderBookData={orderBookData} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SpreadIndicator loading={loading} spreadHistory={spreadHistory} />
              <OrderbookImbalance imbalance={imbalance} />
            
            </div>

            <MarketDepth loading={loading} orderBookData={orderBookData} />
          </div>

        </div>
        </GridLineBackground>
      </div>
  );
}
