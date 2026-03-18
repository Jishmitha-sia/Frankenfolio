# 🧪 ApexMarket Dashboard (Frankenfolio)

> A premium, highly-interactive cryptocurrency telemetry dashboard styled with a sophisticated "glassmorphism" design system.

![ApexMarket Dashboard](public/favicon.svg) <!-- Replace with an actual screenshot in your repo -->

ApexMarket fetches live market intelligence and provides instantaneous tracking of top cryptocurrency assets, featuring automated syncing, 7-day sparklines, personal persistent watchlists, and robust algorithmic column sorting.

## ✨ Elite Features

*   **Live Asset Telemetry & Sparklines:** Tracks top Cryptocurrencies dynamically fetched via the CoinGecko API. Integrated `recharts` paints beautiful 7-day trailing price trajectories.
*   **Global Market Ticker**: Always-on visibility into sweeping market vitals—Active Crypto counts, BTC/ETH Dominance, and trading volumes.
*   **Watchlist Persistence:** Bookmark specific assets using `localStorage`. Your favorites persist seamlessly through deep-refreshes and offline scenarios.
*   **Currency Calculator Engine:** Detailed slide-over analytics panel featuring a real-time `USD` ↔ `Crypto` conversion matrix.
*   **Interactive Column Sorting:** Click any header to instantly reorder the entire table.
*   **Offline Grace:** Specialized `navigator.onLine` interceptions replace console errors with elegant, user-facing telemetry interruption warnings.
*   **Dark & Light Mode:** Fully-typed Tailwind CSS v4 custom variables provide a frictionless toggle between blinding contrast and sleek, glowing darkness.

## 🛠 Tech Stack

*   **Framework:** React 19 (via Vite)
*   **State & Sync:** `@tanstack/react-query` (Caching, Deduplication, Auto-sync)
*   **Styling:** Tailwind CSS v4 (Class-based custom variants + inline `@theme`)
*   **Graphs:** `recharts` for highly-performant SVG inline rendering
*   **Icons:** `lucide-react`

## 🚀 Getting Started

To spin up your own instance of ApexMarket, ensure you have Node.js installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jishmitha-sia/Frankenfolio.git
   ```
2. **Navigate into the directory:**
   ```bash
   cd Frankenfolio/frankenfolio
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Boot the local development server:**
   ```bash
   npm run dev
   ```

## 🏗 Project Architecture Highlight

- `/src/api/cryptoApi.js` — All external fetch logic and error routing is rigidly abstracted from UI components here for cleanliness.
- `/src/hooks/useWatchlist.js` — Custom local storage hook for cleanly managing array state syncing.
- `/src/index.css` — Features sophisticated v4 `@custom-variant` dark mode logic and global `@theme` token definitions (`brand`, `surface`, `animations`).
