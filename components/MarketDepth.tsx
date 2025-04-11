
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

// Reusing the same interfaces
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

interface D3MarketDepthProps {
  loading?: boolean;
  orderBookData: OrderBookData;
  className?: string;
  maxDepth?: number;
}

export default function D3MarketDepth({
  loading = false,
  orderBookData,
  className = "",
  maxDepth = 15,
}: D3MarketDepthProps) {
  const [midPrice, setMidPrice] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedOrderBookEntry[]>([]);

  // Process data on each update
  useEffect(() => {
    if (!orderBookData.bids.length || !orderBookData.asks.length) {
      setProcessedData([]);
      return;
    }

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

    setProcessedData([...processedBids, ...processedAsks]);
  }, [orderBookData, maxDepth]);

  // D3 chart rendering - updated to use lines instead of areas
  useEffect(() => {
    if (loading || !processedData.length || !chartRef.current || !tooltipRef.current) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(processedData, d => d.price) || 0,
        d3.max(processedData, d => d.price) || 0
      ])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(processedData, d => d.total) || 0])
      .range([height, 0]);

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Create bid line
    const bidData = processedData.filter(d => d.type === "bid");
    
    const bidLine = d3
      .line<ProcessedOrderBookEntry>()
      .curve(d3.curveStepAfter)
      .x(d => xScale(d.price))
      .y(d => yScale(d.total));

    svg
      .append("path")
      .datum(bidData)
      .attr("fill", "none")
      .attr("stroke", "#0ecb81")
      .attr("stroke-width", 2.5)
      .attr("d", bidLine);
      
    // Add fill beneath bid line
    const bidArea = d3
      .area<ProcessedOrderBookEntry>()
      .curve(d3.curveStepAfter)
      .x(d => xScale(d.price))
      .y0(height)
      .y1(d => yScale(d.total));
      
    svg
      .append("path")
      .datum(bidData)
      .attr("fill", "url(#bidGradient)")
      .attr("fill-opacity", 0.3)
      .attr("d", bidArea);

    // Create ask line
    const askData = processedData.filter(d => d.type === "ask");
    
    const askLine = d3
      .line<ProcessedOrderBookEntry>()
      .curve(d3.curveStepAfter)
      .x(d => xScale(d.price))
      .y(d => yScale(d.total));

    svg
      .append("path")
      .datum(askData)
      .attr("fill", "none")
      .attr("stroke", "#ea384c")
      .attr("stroke-width", 2.5)
      .attr("d", askLine);
      
    // Add fill beneath ask line
    const askArea = d3
      .area<ProcessedOrderBookEntry>()
      .curve(d3.curveStepAfter)
      .x(d => xScale(d.price))
      .y0(height)
      .y1(d => yScale(d.total));
      
    svg
      .append("path")
      .datum(askData)
      .attr("fill", "url(#askGradient)")
      .attr("fill-opacity", 0.3)
      .attr("d", askArea);

    // Add gradients
    const defs = svg.append("defs");

    // Bid gradient
    const bidGradient = defs
      .append("linearGradient")
      .attr("id", "bidGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    bidGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(14, 203, 129, 0.7)");

    bidGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(14, 203, 129, 0)");

    // Ask gradient
    const askGradient = defs
      .append("linearGradient")
      .attr("id", "askGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    askGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(234, 56, 76, 0.7)");

    askGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(234, 56, 76, 0)");

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("color", "#8E9196")
      .call(d3.axisBottom(xScale).tickFormat(d => d3.format(".2f")(+d)))
      .selectAll("line, path")
      .attr("stroke", "#2A2F3C");

    svg
      .append("g")
      .attr("color", "#8E9196")
      .call(d3.axisLeft(yScale).tickFormat(d => d3.format(".2f")(+d)))
      .selectAll("line, path")
      .attr("stroke", "#2A2F3C");

    // Add reference line for mid price
    if (midPrice) {
      svg
        .append("line")
        .attr("x1", xScale(midPrice))
        .attr("x2", xScale(midPrice))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "#9b87f5")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,4");
        
      // Add mid price label
      svg
        .append("text")
        .attr("x", xScale(midPrice))
        .attr("y", -5)
        .attr("fill", "#9b87f5")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text(`$${midPrice.toFixed(2)}`);
    }

    // Add data points
    svg
      .selectAll(".bid-point")
      .data(bidData.filter((_, i) => i % 3 === 0)) // Add points every 3rd data point for better visibility
      .enter()
      .append("circle")
      .attr("class", "bid-point")
      .attr("cx", d => xScale(d.price))
      .attr("cy", d => yScale(d.total))
      .attr("r", 3)
      .attr("fill", "#0ecb81");

    svg
      .selectAll(".ask-point")
      .data(askData.filter((_, i) => i % 3 === 0)) // Add points every 3rd data point
      .enter()
      .append("circle")
      .attr("class", "ask-point")
      .attr("cx", d => xScale(d.price))
      .attr("cy", d => yScale(d.total))
      .attr("r", 3)
      .attr("fill", "#ea384c");

    // Add interactive overlay for tooltips
    const bisect = d3.bisector<ProcessedOrderBookEntry, number>(d => d.price).center;
    
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mousemove", function (event) {
        const mouseX = d3.pointer(event)[0];
        const x0 = xScale.invert(mouseX);
        
        // Find closest data point
        let closestBidIndex = -1;
        let closestAskIndex = -1;
        
        if (bidData.length) {
          closestBidIndex = bisect(bidData, x0);
          if (closestBidIndex >= bidData.length) closestBidIndex = bidData.length - 1;
        }
        
        if (askData.length) {
          closestAskIndex = bisect(askData, x0);
          if (closestAskIndex >= askData.length) closestAskIndex = askData.length - 1;
        }
        
        let closestPoint: ProcessedOrderBookEntry | null = null;
        
        if (closestBidIndex >= 0 && closestAskIndex >= 0) {
          const bidPoint = bidData[closestBidIndex];
          const askPoint = askData[closestAskIndex];
          
          const bidDist = Math.abs(bidPoint.price - x0);
          const askDist = Math.abs(askPoint.price - x0);
          
          closestPoint = bidDist < askDist ? bidPoint : askPoint;
        } else if (closestBidIndex >= 0) {
          closestPoint = bidData[closestBidIndex];
        } else if (closestAskIndex >= 0) {
          closestPoint = askData[closestAskIndex];
        }
        
        if (closestPoint) {
          const x = xScale(closestPoint.price);
          const y = yScale(closestPoint.total);
          
          // Show tooltip
          tooltip
            .style("display", "block")
            .style("left", `${event.offsetX + 10}px`)
            .style("top", `${event.offsetY + 10}px`)
            .html(`
              <p class="text-[#8E9196]">Price: <span class="text-white">${closestPoint.price.toFixed(2)}</span></p>
              <p class="${closestPoint.type === "bid" ? "text-[#0ecb81]" : "text-[#ea384c]"}">
                ${closestPoint.type === "bid" ? "Bid" : "Ask"} Total: ${closestPoint.total.toFixed(5)}
              </p>
            `);
          
          // Highlight point
          svg.selectAll(".hover-point").remove();
          svg
            .append("circle")
            .attr("class", "hover-point")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 5)
            .attr("fill", closestPoint.type === "bid" ? "#0ecb81" : "#ea384c")
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 1)
            .style("filter", "drop-shadow(0 0 3px rgba(255,255,255,0.5))");
            
          // Add vertical guide line
          svg.selectAll(".guide-line").remove();
          svg
            .append("line")
            .attr("class", "guide-line")
            .attr("x1", x)
            .attr("x2", x)
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 0.5)
            .attr("stroke-dasharray", "2,2")
            .style("opacity", 0.5);
        }
      })
      .on("mouseleave", function () {
        tooltip.style("display", "none");
        svg.selectAll(".hover-point").remove();
        svg.selectAll(".guide-line").remove();
      });

     
        
      
      const legendY = 15;
      
      // Bid legend
      svg
        .append("rect")
        .attr("x", 5)
        .attr("y", legendY - 7)
        .attr("width", 14)
        .attr("height", 2)
        .attr("fill", "#0ecb81");
        
      svg
        .append("text")
        .attr("x", 25)
        .attr("y", legendY)
        .attr("text-anchor", "start")
        .attr("fill", "#8E9196")
        .attr("font-size", "10px")
        .text("Bids");
        
      // Ask legend
      svg
        .append("rect")
        .attr("x", 70)
        .attr("y", legendY - 7)
        .attr("width", 14)
        .attr("height", 2)
        .attr("fill", "#ea384c");
        
      svg
        .append("text")
        .attr("x", 90)
        .attr("y", legendY)
        .attr("text-anchor", "start")
        .attr("fill", "#8E9196")
        .attr("font-size", "10px")
        .text("Asks");

  }, [processedData, loading, midPrice]);

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
          <div className="relative h-[300px] w-full">
            <svg ref={chartRef} width="100%" height="300" />
            <div 
              ref={tooltipRef} 
              className="absolute bg-[#121212] p-2 border border-[#2A2F3C] rounded shadow-lg z-10 hidden" 
              style={{ pointerEvents: 'none' }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
