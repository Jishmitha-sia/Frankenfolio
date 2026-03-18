# Frankenfolio Dashboard

> A premium, highly-interactive cryptocurrency telemetry dashboard 

Frankenfolio fetches live market intelligence and provides instantaneous tracking of top cryptocurrency assets. It features automated network syncing, 7-day sparkline visualizations, personal persistent watchlists, and algorithmic column sorting.

## Features

*   **Live Asset Telemetry & Sparklines:** Tracks top Cryptocurrencies dynamically fetched via the CoinGecko API. Integrated `recharts` paints beautiful 7-day trailing price trajectories.
*   **Global Market Ticker**: Always-on visibility into sweeping market vitals—Active Crypto counts, BTC/ETH Dominance, and trading volumes—centered dynamically at the top of the interface.
*   **Watchlist Persistence:** Bookmark specific assets using `localStorage`. Your favorites persist seamlessly through deep-refreshes and offline scenarios. Includes a dedicated one-click Watchlist filter!
*   **Currency Calculator Engine:** Detailed slide-over analytics panel featuring a real-time `USD` ↔ `Crypto` conversion matrix.
*   **Interactive Column Sorting:** Click any header to instantly reorder the entire dataset (Watch, Asset, Price, Momentum, Market Cap).
*   **Deep Hover Interactions:** Moving your mouse across the table triggers elegant structural pop-out animations and localized glowing box-shadows.
*   **Shimmering Loaders & Pagination:** No static loading screens. The UI boots up with elegant skeleton frameworks and supports infinite dataset expansion via the "Load More" gateway.
*   **Offline Grace:** Specialized `navigator.onLine` interceptions replace console errors with elegant, user-facing telemetry interruption warnings.
*   **Custom Dark/Light Mode:** Fully-typed Tailwind CSS v4 custom variants provide a frictionless toggle between blinding contrast and sleek, glowing darkness.

## Tech Stack

*   **Framework:** React 19 (via Vite)
*   **State & Sync:** `@tanstack/react-query` (Caching, Deduplication, Auto-sync)
*   **Styling:** Tailwind CSS v4 (Class-based custom variants + inline `@theme`)
*   **Graphs:** `recharts` for highly-performant SVG inline rendering
*   **Icons:** `lucide-react`

## Getting Started

To spin up your own instance of Frankenfolio locally, ensure you have Node.js installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jishmitha-sia/Frankenfolio.git
   ```
2. **Navigate into the project directory:**
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

## Project Architecture Highlight

- `/frankenfolio/src/api/cryptoApi.js` — All external fetch logic and error routing is rigidly abstracted from UI components here for cleanliness.
- `/frankenfolio/src/hooks/useWatchlist.js` — Custom local storage hook for cleanly managing array state syncing.
- `/frankenfolio/src/index.css` — Features sophisticated v4 class-based dark mode logic and global `@theme` token definitions (`brand`, `surface`, `animations`).
