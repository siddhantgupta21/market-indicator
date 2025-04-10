import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpreadHistoryEntry {
  time: number;
  spread: number;
}

interface SpreadIndicatorProps {
  loading: boolean;
  spreadHistory: SpreadHistoryEntry[];
  className?: string;
}

export default function SpreadIndicator({
  loading,
  spreadHistory,
  className = "",
}: SpreadIndicatorProps) {
  return (
    <Card className={cn("bg-[#121212] border-[#2A2F3C] shadow-xl w-full", className)}>
      <CardHeader className="pb-2 border-b border-[#2A2F3C]">
        <CardTitle className="text-white text-lg font-medium">
          <div className="flex items-center">
            <ArrowUpDown className="mr-2 h-5 w-5 text-[#9b87f5]" />
            <span>Spread Indicator</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5]"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={spreadHistory}>
              <XAxis
                dataKey="time"
                tickFormatter={(unixTime: number) =>
                  new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                }
                stroke="#8E9196"
                tick={{ fill: "#8E9196", fontSize: 10 }}
              />
              <YAxis 
                stroke="#8E9196" 
                tick={{ fill: "#8E9196", fontSize: 10 }}
                width={40}
              />
              <Tooltip
                labelFormatter={(unixTime: number) =>
                  new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                }
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spread']}
                contentStyle={{
                  backgroundColor: "#1A1F2C",
                  border: "1px solid #2A2F3C",
                  borderRadius: "4px",
                  color: "#f8f9fa",
                }}
                itemStyle={{ color: "#f8f9fa" }}
              />
              <Area
                type="monotone"
                dataKey="spread"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#spreadGradient)"
                fillOpacity={0.2}
                isAnimationActive={false}
              />
              <defs>
                <linearGradient id="spreadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
