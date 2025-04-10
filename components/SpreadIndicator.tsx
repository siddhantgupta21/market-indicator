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
import { Spinner } from "@/components/ui/spinner";

interface SpreadHistoryEntry {
  time: number;
  spread: number;
}

interface SpreadIndicatorProps {
  loading: boolean;
  spreadHistory: SpreadHistoryEntry[];
}

export default function SpreadIndicator({
  loading,
  spreadHistory,
}: SpreadIndicatorProps) {
  return (
    <Card className="bg-gray-800 border-yellow-500 shadow-lg opacity-95 w-full">
      <CardHeader>
        <CardTitle className="text-yellow-500 flex items-center text-lg sm:text-xl">
          <ArrowUpDown className="mr-2" />
          Spread Indicator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Spinner />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={spreadHistory}>
              <XAxis
                dataKey="time"
                tickFormatter={(unixTime: number) =>
                  new Date(unixTime).toLocaleTimeString()
                }
                stroke="#22c55e"
              />
              <YAxis stroke="#22c55e" />
              <Tooltip
                labelFormatter={(unixTime: number) =>
                  new Date(unixTime).toLocaleTimeString()
                }
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #22c55e",
                  color: "#FFD700",
                }}
                itemStyle={{ color: "#FFD700" }}
              />
              <Area
                type="monotone"
                dataKey="spread"
                stroke="#22c55e"
                fill="url(#spreadGradient)"
                fillOpacity={0.2}
              />
              <defs>
                <linearGradient id="spreadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
