import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Scale } from "lucide-react";

interface OrderbookImbalanceProps {
  imbalance: number;  // Value between -1 (sell pressure) and 1 (buy pressure)
  className?: string;
}

export default function OrderbookImbalance({
  imbalance,
  className = "",
}: OrderbookImbalanceProps) {
  // Ensure imbalance is within range -1 to 1
  const boundedImbalance = Math.max(-1, Math.min(1, imbalance));
  
  // Convert -1 to 1 range to 0 to 100 for width percentage
  const indicatorPosition = (boundedImbalance + 1) * 50;
  
  return (
    <Card className={cn("bg-[#121212] border-[#2A2F3C] shadow-xl w-full", className)}>
      <CardHeader className="pb-2 border-b border-[#2A2F3C]">
        <CardTitle className="text-white text-lg font-medium">
          <div className="flex items-center">
            <Scale className="mr-2 h-5 w-5 text-[#9b87f5]" />
            <span>Order Imbalance</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4">
        <div className="h-[200px] flex flex-col justify-center">
          <div className="w-full h-6 bg-[#1A1F2C] rounded-full mb-6 relative">
            {/* Gradient bar */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="w-full h-full bg-gradient-to-r from-[#ea384c] to-[#0ecb81]"></div>

            </div>
            
            {/* Indicator */}
            <div 
              className="absolute top-0 h-full"
              style={{ 
                left: `calc(${indicatorPosition}% - 4px)`,
                transform: "translateX(-50%)" 
              }}
            >
              <div className="h-10 w-2 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.7)]"></div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-[#8E9196]">
            <span className="text-[#ea384c]">Sell Pressure</span>
            <span>Neutral</span>
            <span className="text-[#0ecb81]">Buy Pressure</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}