import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";

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
  return (
    <Card
      className={`bg-gray-800 border-yellow-500 shadow-lg opacity-95 w-full ${className}`}
    >
      <CardHeader>
        <CardTitle className="text-yellow-500 text-lg sm:text-xl">
          Order Book
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-center text-green-500 font-semibold mb-2">
                Bids
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-green-400">
                        Price
                      </TableHead>
                      <TableHead className="text-right text-green-400">
                        Amount
                      </TableHead>
                      <TableHead className="text-right text-green-400">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderBookData.bids.map((bid) => (
                      <TableRow
                        key={bid.price}
                        className={`transition-colors ${
                          bid.change > 0
                            ? "text-green-500"
                            : bid.change < 0
                            ? "text-red-500"
                            : "text-green-400"
                        }`}
                      >
                        <TableCell className="text-right font-medium">
                          {bid.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {bid.amount.toFixed(5)}
                        </TableCell>
                        <TableCell className="text-right">
                          {bid.total.toFixed(5)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div>
              <h3 className="text-center text-red-500 font-semibold mb-2">
                Asks
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-green-400">
                        Price
                      </TableHead>
                      <TableHead className="text-right text-green-400">
                        Amount
                      </TableHead>
                      <TableHead className="text-right text-green-400">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderBookData.asks.map((ask) => (
                      <TableRow
                        key={ask.price}
                        className={`transition-colors ${
                          ask.change > 0
                            ? "text-green-500"
                            : ask.change < 0
                            ? "text-red-500"
                            : "text-green-400"
                        }`}
                      >
                        <TableCell className="text-right font-medium">
                          {ask.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {ask.amount.toFixed(5)}
                        </TableCell>
                        <TableCell className="text-right">
                          {ask.total.toFixed(5)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
