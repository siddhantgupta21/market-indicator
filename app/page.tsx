"use client"
import VantaBackground from "./components/VantaBackground"
import { useState, useEffect } from "react"
import Header from "@/components/Header"
import SpreadIndicator from "@/components/SpreadIndicator"
import OrderbookImbalance from "@/components/OrderbookImbalance"
import MarketDepth from "@/components/MarketDepth"
import OrderBook from "@/components/OrderBook"
import TabbedInterface from "@/components/TabbedInterface"
import { tradingPairs, type TradingPair } from "@/constants/trading"
import { ThemeToggle } from "@/components/ThemeToggle"


// Interface for an individual order book entry
interface OrderBookEntry {
  price: number
  amount: number
  total?: number // Marking as optional for entries before calculation
  change?: number // Marking as optional for entries before calculation
}

// Interface for the order book data
interface OrderBookData {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

// Interface for spread history entry
interface SpreadHistoryEntry {
  time: number
  spread: number
}

export default function Home() {
  const [orderBookData, setOrderBookData] = useState<OrderBookData>({
    bids: [],
    asks: [],
  })
  const [spreadHistory, setSpreadHistory] = useState<SpreadHistoryEntry[]>([])
  const [imbalance, setImbalance] = useState<number>(0)
  const [selectedPair, setSelectedPair] = useState<TradingPair>(tradingPairs[0])
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("orderbook")

  useEffect(() => {
    // Close existing WebSocket if any
    if (ws) {
      ws.close()
    }

    const newWs = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedPair.symbol.toLowerCase()}@depth20@100ms`)
    setWs(newWs)

    newWs.onopen = () => setLoading(false)

    newWs.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)

        const processPriceLevel = (
          level: [string, string] | { price: string; amount: string },
        ): { price: number; amount: number } => {
          if (Array.isArray(level)) {
            return {
              price: Number.parseFloat(level[0]),
              amount: Number.parseFloat(level[1]),
            }
          }
          return {
            price: Number.parseFloat(level.price),
            amount: Number.parseFloat(level.amount),
          }
        }

        const processOrders = (
          orders: [string, string][] | Record<string, string>,
        ): { price: number; amount: number }[] => {
          if (Array.isArray(orders)) {
            return orders.map(processPriceLevel)
          }
          return Object.entries(orders).map(([price, amount]) => ({
            price: Number.parseFloat(price),
            amount: Number.parseFloat(amount),
          }))
        }

        const bids = processOrders(data.bids || [])
        const asks = processOrders(data.asks || [])

        setOrderBookData((prevData) => {
          const newBids = bids.slice(0, 10).map((bid, index) => ({
            ...bid,
            total: bids.slice(0, index + 1).reduce((sum, b) => sum + b.amount, 0),
            change: prevData.bids[index] ? bid.amount - prevData.bids[index].amount : 0,
          }))

          const newAsks = asks.slice(0, 10).map((ask, index) => ({
            ...ask,
            total: asks.slice(0, index + 1).reduce((sum, a) => sum + a.amount, 0),
            change: prevData.asks[index] ? ask.amount - prevData.asks[index].amount : 0,
          }))

          return { bids: newBids, asks: newAsks }
        })

        const bestBid = bids.length > 0 ? bids[0].price : 0
        const bestAsk = asks.length > 0 ? asks[0].price : 0
        const spread = bestAsk - bestBid

        setSpreadHistory((prev) => [...prev.slice(-59), { time: Date.now(), spread }])

        const bidVolume = bids.reduce((sum, bid) => sum + bid.amount, 0)
        const askVolume = asks.reduce((sum, ask) => sum + ask.amount, 0)
        setImbalance((bidVolume - askVolume) / (bidVolume + askVolume))
      } catch (error) {
        console.error("Error processing WebSocket data:", error)
      }
    }

    return () => {
      // Close WebSocket on cleanup
      if (newWs) {
        newWs.close()
      }
    }
  }, [selectedPair])

  const handlePairChange = (value: string) => {
    const newPair = tradingPairs.find((pair) => pair.symbol === value)
    if (newPair) {
      setSelectedPair(newPair)
      setLoading(true)
    }
  }

  const tabs = [
    { id: "orderbook", label: "Order Book" },
    { id: "spread", label: "Spread Indicator" },
    { id: "imbalance", label: "Imbalance Indicator" },
    { id: "depth", label: "Market Depth" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "orderbook":
        return <OrderBook loading={loading} orderBookData={orderBookData} className="w-full" />
      case "spread":
        return <SpreadIndicator loading={loading} spreadHistory={spreadHistory} className="w-full" />
      case "imbalance":
        return <OrderbookImbalance imbalance={imbalance} className="w-full" />
      case "depth":
        return <MarketDepth loading={loading} orderBookData={orderBookData} className="w-full" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen text-white">
      <VantaBackground>
      <div className="relative z-10 max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <Header selectedPair={selectedPair} onPairChange={handlePairChange} />
        
        <div className="space-y-6">
          <TabbedInterface tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} className="mb-6" />
          <div className="min-h-[400px] backdrop-blur-sm rounded-lg p-4">{renderTabContent()}</div>
        </div>
      </div>
      </VantaBackground>
    </div>
  )
}
