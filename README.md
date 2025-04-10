# Blockchain Exchange

## Real-Time Cryptocurrency Order Book and Market Data Visualization

Blockchain Exchange is a Next.js application that provides real-time cryptocurrency order book and market data visualization. It offers a comprehensive view of the cryptocurrency market, focusing on three main trading pairs: BTC-USD, ETH-USD, and XRP-USD.

## Features

- Real-time order book display
- Market depth visualization
- Spread indicator
- Orderbook imbalance meter
- Support for multiple trading pairs
- Responsive design for desktop and mobile devices

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [Recharts](https://recharts.org/) - Composable charting library for React
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) - For real-time data communication

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone [https://github.com/Nishant-245/crypto-orderbook]
   ```

2. Install the dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add any necessary environment variables.

4. Run the development server:

   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- Select a trading pair from the dropdown menu to view its order book and market data.
- The order book displays real-time bids and asks.
- The market depth chart visualizes the cumulative volume of buy and sell orders.
- The spread indicator shows the difference between the best bid and ask prices over time.
- The orderbook imbalance meter represents the balance between buy and sell pressure.

## Acknowledgments

- Data provided by [Binance API](https://binance-docs.github.io/apidocs/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

## Contact

If you have any questions, feel free to reach out to [chauhan.nishant2004@gmail.com](mailto:chauhan.nishant2004@gmail.com).
