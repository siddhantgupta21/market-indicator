import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  change: number;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

interface OrderBookProps {
  loading: boolean;
  orderBookData: OrderBookData;
  className?: string;
}

export default function OrderBook({
  loading,
  orderBookData,
  className = "",
}: OrderBookProps) {
  const [precision, setPrecision] = useState(2);
  const prevPricesRef = useRef<Record<string, number>>({});
  const flashPricesRef = useRef<Record<string, "increase" | "decrease">>({});
  
  // Calculate the max total for depth visualization
  const maxBidTotal = orderBookData.bids.length > 0 
    ? Math.max(...orderBookData.bids.map(bid => bid.total))
    : 0;
    
  const maxAskTotal = orderBookData.asks.length > 0 
    ? Math.max(...orderBookData.asks.map(ask => ask.total))
    : 0;

  // Handle price flash animations
  useEffect(() => {
    const newFlashPrices: Record<string, "increase" | "decrease"> = {};
    
    // Check bids
    orderBookData.bids.forEach(bid => {
      const prevPrice = prevPricesRef.current[`bid-${bid.price}`];
      if (prevPrice !== undefined) {
        if (bid.price > prevPrice) {
          newFlashPrices[`bid-${bid.price}`] = "increase";
        } else if (bid.price < prevPrice) {
          newFlashPrices[`bid-${bid.price}`] = "decrease";
        }
      }
      prevPricesRef.current[`bid-${bid.price}`] = bid.price;
    });
    
    // Check asks
    orderBookData.asks.forEach(ask => {
      const prevPrice = prevPricesRef.current[`ask-${ask.price}`];
      if (prevPrice !== undefined) {
        if (ask.price > prevPrice) {
          newFlashPrices[`ask-${ask.price}`] = "increase";
        } else if (ask.price < prevPrice) {
          newFlashPrices[`ask-${ask.price}`] = "decrease";
        }
      }
      prevPricesRef.current[`ask-${ask.price}`] = ask.price;
    });
    
    flashPricesRef.current = newFlashPrices;
    
    // Clear flash animations after a short time
    const timer = setTimeout(() => {
      flashPricesRef.current = {};
    }, 500);
    
    return () => clearTimeout(timer);
  }, [orderBookData]);

  return (
    <Card className={cn("bg-[#121212] border-[#2A2F3C] shadow-xl w-full", className)}>
      <CardHeader className="pb-2 border-b border-[#2A2F3C]">
        <CardTitle className="text-white text-lg font-medium">
          <div className="flex items-center justify-between w-full">
            <div className="text-[#0ecb81]">Buy Order</div>
            <div className="text-[#ea384c]">Sell Order</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5]"></div>
          </div>
        ) : (
          <div className="flex">
            {/* Bids (buy orders) */}
            <div className="w-1/2 border-r border-[#2A2F3C]">
              <div className="grid grid-cols-4 text-xs text-[#8E9196] p-2 border-b border-[#2A2F3C]">
                <div className="text-left">Price (USDT)</div>
                <div className="text-right">Amount (BTC)</div>
                <div className="text-right">Total (USDT)</div>
                <div className="text-right">Sum (USDT)</div>
              </div>
              <div className="relative">
                {orderBookData.bids.map((bid) => {
                  const depthPercentage = (bid.total / maxBidTotal) * 100;
                  const flashState = flashPricesRef.current[`bid-${bid.price}`];
                  
                  return (
                    <div key={bid.price} className="relative">
                      <div 
                        className="absolute top-0 left-0 h-full bg-[#0ecb81]/10" 
                        style={{ width: `${depthPercentage}%` }}
                      ></div>
                      <div className="grid grid-cols-4 relative z-10 p-2 text-xs hover:bg-[#2A2F3C]/50">
                        <div 
                          className={cn(
                            "text-left font-medium text-[#0ecb81]", 
                            flashState === "increase" && "flash-green",
                            flashState === "decrease" && "flash-red"
                          )}
                        >
                          {bid.price.toFixed(precision)}
                        </div>
                        <div className="text-right text-[#f8f9fa]">
                          {bid.amount.toFixed(5)}
                        </div>
                        <div className="text-right text-[#f8f9fa]">
                          {(bid.amount * bid.price).toFixed(precision)}
                        </div>
                        <div className="text-right text-[#8E9196]">
                          {bid.total.toFixed(precision)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Asks (sell orders) */}
            <div className="w-1/2">
              <div className="grid grid-cols-4 text-xs text-[#8E9196] p-2 border-b border-[#2A2F3C]">
                <div className="text-left">Price (USDT)</div>
                <div className="text-right">Amount (BTC)</div>
                <div className="text-right">Total (USDT)</div>
                <div className="text-right">Sum (USDT)</div>
              </div>
              <div className="relative">
                {orderBookData.asks.map((ask) => {
                  const depthPercentage = (ask.total / maxAskTotal) * 100;
                  const flashState = flashPricesRef.current[`ask-${ask.price}`];
                  
                  return (
                    <div key={ask.price} className="relative">
                      <div 
                        className="absolute top-0 right-0 h-full bg-[#ea384c]/10" 
                        style={{ width: `${depthPercentage}%` }}
                      ></div>
                      <div className="grid grid-cols-4 relative z-10 p-2 text-xs hover:bg-[#2A2F3C]/50">
                        <div 
                          className={cn(
                            "text-left font-medium text-[#ea384c]", 
                            flashState === "increase" && "flash-green",
                            flashState === "decrease" && "flash-red"
                          )}
                        >
                          {ask.price.toFixed(precision)}
                        </div>
                        <div className="text-right text-[#f8f9fa]">
                          {ask.amount.toFixed(5)}
                        </div>
                        <div className="text-right text-[#f8f9fa]">
                          {(ask.amount * ask.price).toFixed(precision)}
                        </div>
                        <div className="text-right text-[#8E9196]">
                          {ask.total.toFixed(precision)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}