import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTopCoins, fetchGlobalData } from './api/cryptoApi';
import { useWatchlist } from './hooks/useWatchlist';
import { RefreshCw, Search, Star, Moon, Sun, TrendingUp, TrendingDown, Activity, AlertCircle, X, Info, ArrowUp, ArrowDown, Globe, Calculator, ArrowRightLeft, Layers } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

// Skeleton Loader Component
const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-light-border dark:border-dark-border">
    <td className="px-6 py-5 text-center"><div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto"></div></td>
    <td className="px-6 py-5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-5 text-right"><div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-20 ml-auto"></div></td>
    <td className="px-6 py-5 text-right flex justify-end gap-3 items-center">
      <div className="w-24 h-10 bg-slate-200 dark:bg-slate-800 rounded hidden sm:block"></div>
      <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div>
    </td>
    <td className="px-6 py-5 text-right hidden md:table-cell"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16 ml-auto"></div></td>
  </tr>
);

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
  const [usdInput, setUsdInput] = useState('1000');
  const [assetLimit, setAssetLimit] = useState(10);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || true;
    }
    return true;
  });
  
  const [selectedCoin, setSelectedCoin] = useState(null);
  const { watchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const { data: globalData } = useQuery({
    queryKey: ['globalData'],
    queryFn: fetchGlobalData,
    refetchInterval: 300000, 
    staleTime: 120000,
  });

  const { data: coins, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['topCoins', assetLimit],
    queryFn: () => fetchTopCoins(assetLimit),
    refetchInterval: 60000, 
    staleTime: 30000,
  });

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredCoins = useMemo(() => {
    let processableCoins = coins ? [...coins] : [];
    
    if (searchTerm) {
      processableCoins = processableCoins.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    processableCoins.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'starred') {
        aValue = watchlist.includes(a.id) ? 1 : 0;
        bValue = watchlist.includes(b.id) ? 1 : 0;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return processableCoins;
  }, [coins, searchTerm, sortConfig, watchlist]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowDown size={14} className="opacity-0 group-hover:opacity-30 transition-opacity" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-brand-500" /> 
      : <ArrowDown size={14} className="text-brand-500" />;
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-brand-500/30 selection:text-brand-600">
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex justify-center items-center">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow object-right-bottom" style={{ animationDelay: '2s' }}></div>
      </div>

      {globalData && (
        <div className="relative z-10 w-full bg-slate-900 text-white dark:bg-black/80 border-b border-white/10 overflow-hidden shadow-sm text-[11px] font-mono tracking-widest sm:text-xs">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between opacity-80 animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap no-scrollbar">
              <span className="flex items-center gap-1.5 text-brand-400">
                <Globe size={14} /> GLOBAL METRICS
              </span>
              <span>Active Assets: <strong className="text-white">{globalData.active_cryptocurrencies.toLocaleString()}</strong></span>
              <span>Markets: <strong className="text-white">{globalData.markets.toLocaleString()}</strong></span>
              <span>BTC Dominance: <strong className="text-brand-400">{globalData.market_cap_percentage.btc.toFixed(1)}%</strong></span>
              <span>ETH Dominance: <strong className="text-brand-400">{globalData.market_cap_percentage.eth.toFixed(1)}%</strong></span>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-screen">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 glass-panel rounded-3xl p-6 lg:p-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-500/10 dark:bg-brand-500/20 rounded-2xl shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              <Activity className="text-brand-600 dark:text-brand-500" size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Apex<span className="text-gradient">Market</span>
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
                Real-time Asset Intelligence
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3.5 rounded-2xl bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border text-slate-600 dark:text-slate-300 hover:scale-105 hover:shadow-lg transition-all flex-shrink-0"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => refetch()} 
              disabled={isFetching}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white dark:text-black px-6 py-3.5 rounded-2xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(57,255,20,0.3)] hover:shadow-[0_8px_30px_rgba(57,255,20,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <RefreshCw className={isFetching ? "animate-spin" : ""} size={18} />
              {isFetching ? "Syncing Network..." : "Live Sync"}
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <div className="relative w-full max-w-2xl mx-auto mb-10 group animate-in zoom-in-95 duration-500 delay-150">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-brand-500 transition-colors" size={22} />
            </div>
            <input 
              type="text"
              placeholder="Search assets by name or ticker..."
              className="w-full py-5 pl-14 pr-6 rounded-3xl border border-light-border dark:border-dark-border bg-white/50 dark:bg-dark-surface/50 backdrop-blur-md outline-none focus:ring-2 focus:ring-brand-500/50 shadow-sm hover:shadow-md transition-all text-lg font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isError && (
             <div className="mx-auto max-w-2xl w-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-6 rounded-3xl flex items-start gap-4 shadow-lg mb-8">
               <AlertCircle size={28} className="shrink-0 mt-0.5" />
               <div>
                  <h3 className="text-lg font-bold mb-1">Telemetry Interrupted</h3>
                  <p className="font-medium opacity-90">{error.message}</p>
                  <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-500/20 rounded-xl font-bold hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors">
                    Retry Connection
                  </button>
               </div>
             </div>
          )}

          {!isError && (
            <div className="glass-panel rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border bg-slate-50/80 dark:bg-white/5">
                      <th 
                        className="px-6 py-5 w-16 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors group select-none"
                        onClick={() => handleSort('starred')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Watch <SortIcon columnKey="starred" />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors group select-none"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-1">
                          Asset <SortIcon columnKey="name" />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors group select-none"
                        onClick={() => handleSort('current_price')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Price USD <SortIcon columnKey="current_price" />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors group select-none"
                        onClick={() => handleSort('price_change_percentage_24h')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          24h Momentum <SortIcon columnKey="price_change_percentage_24h" />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors group select-none"
                        onClick={() => handleSort('market_cap')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Market Cap <SortIcon columnKey="market_cap" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-border dark:divide-dark-border">
                    {isLoading && !coins ? (
                      [...Array(assetLimit)].map((_, i) => <SkeletonRow key={`idx-${i}`} />)
                    ) : sortedAndFilteredCoins?.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-20 text-center text-slate-500 dark:text-slate-400">
                          <Search size={48} className="mx-auto mb-4 opacity-20" />
                          <p className="text-xl font-medium text-slate-600 dark:text-slate-300">No assets found matching "{searchTerm}"</p>
                          <p className="mt-2 text-sm">Try searching for returning assets or clear filters.</p>
                        </td>
                      </tr>
                    ) : (
                      sortedAndFilteredCoins?.map((coin) => {
                        const isStarred = watchlist.includes(coin.id);
                        const isPositive = coin.price_change_percentage_24h > 0;
                        
                        return (
                          <tr 
                            key={coin.id} 
                            onClick={() => setSelectedCoin(coin)}
                            className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                          >
                            <td className="px-6 py-5 text-center">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWatchlist(coin.id);
                                }}
                                className="p-2 -m-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-500 bg-transparent border-none appearance-none"
                                aria-label={isStarred ? "Remove from watchlist" : "Add to watchlist"}
                              >
                                <Star 
                                  size={22} 
                                  className={`transition-all duration-300 ${isStarred ? 'text-yellow-400 fill-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-slate-300 dark:text-slate-600 group-hover:text-amber-300 dark:group-hover:text-amber-500'}`} 
                                />
                              </button>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full shadow-sm" />
                                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"></div>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors">
                                    {coin.name}
                                  </span>
                                  <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/10 self-start px-2 py-0.5 rounded-md mt-1">
                                    {coin.symbol}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <span className="font-mono text-lg font-semibold text-slate-900 dark:text-white">
                                ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-end gap-3 w-full">
                                {coin.sparkline_in_7d && (
                                  <div className="w-24 h-10 hidden sm:block opacity-80 group-hover:opacity-100 transition-opacity">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={coin.sparkline_in_7d.price.map((p, i) => ({ value: p, index: i }))}>
                                        <YAxis dataKey="value" domain={['dataMin', 'dataMax']} hide />
                                        <Line 
                                          type="monotone" 
                                          dataKey="value" 
                                          stroke={isPositive ? '#10b981' : '#f43f5e'} 
                                          strokeWidth={2} 
                                          dot={false}
                                          isAnimationActive={true}
                                        />
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                )}
                                <div className={`inline-flex items-center justify-end gap-1.5 px-3 py-1 rounded-full font-bold text-sm whitespace-nowrap min-w-[90px] ${
                                  isPositive 
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                                  }`}
                                >
                                  {isPositive ? <TrendingUp size={16} strokeWidth={3} /> : <TrendingDown size={16} strokeWidth={3} />}
                                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right hidden md:table-cell font-mono text-sm font-medium text-slate-500 dark:text-slate-400">
                              ${(coin.market_cap / 1e9).toFixed(2)}B
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Load More Expansion Frame */}
              {!isLoading && sortedAndFilteredCoins?.length > 0 && assetLimit <= 50 && (
                <div className="p-4 flex justify-center border-t border-light-border dark:border-dark-border bg-slate-50/30 dark:bg-dark-surface/30">
                  <button 
                    onClick={() => setAssetLimit(prev => prev + 10)}
                    disabled={isFetching}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/50 hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Layers size={16} />
                    {isFetching ? "Digging deeper..." : "Expand Dataset"}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="mt-12 text-center pb-6 text-sm font-medium text-slate-400 dark:text-slate-500">
          Powered by CoinGecko API • Real-time Data Validation
        </footer>
      </div>

      {selectedCoin && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div 
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
            onClick={() => setSelectedCoin(null)}
          ></div>
          
          <div className="absolute inset-y-0 right-0 w-full max-w-md flex">
            <div className="w-full h-full bg-light-bg dark:bg-dark-bg border-l border-light-border dark:border-dark-border shadow-[0_0_50px_rgba(0,0,0,0.2)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 ease-out">
              
              <div className="flex items-center justify-between p-6 lg:p-8 border-b border-light-border dark:border-dark-border bg-white dark:bg-dark-surface relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="flex items-center gap-4 relative z-10 w-full">
                  <img src={selectedCoin.image} alt={selectedCoin.name} className="w-16 h-16 rounded-full drop-shadow-lg" />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white truncate">{selectedCoin.name}</h2>
                    <span className="font-mono text-sm font-bold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2 py-1 rounded mt-1 inline-block uppercase">
                      {selectedCoin.symbol}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedCoin(null)} 
                  className="p-2 rounded-full absolute top-6 right-6 bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-white/10 text-slate-500 transition-colors z-10"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
                
                <div className="p-6 rounded-3xl bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Activity size={18} />
                      <span className="text-xs uppercase font-bold tracking-widest">Current Valuation</span>
                    </div>
                  </div>
                  <div className="text-4xl font-mono font-black text-slate-900 dark:text-white tracking-tight break-words">
                    ${selectedCoin.current_price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/20 shadow-inner">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 mb-4 uppercase tracking-widest">
                    <Calculator size={16} /> Asset Conversion
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex gap-3 items-center">
                      <div className="flex-1 bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl px-4 py-3 flex items-center justify-between">
                         <span className="font-bold text-slate-400 text-sm mr-2 select-none">USD</span>
                         <input 
                           type="number" 
                           className="w-full text-right font-mono font-bold text-lg bg-transparent outline-none text-slate-900 dark:text-white"
                           value={usdInput}
                           onChange={(e) => setUsdInput(e.target.value)}
                           min="0"
                         />
                      </div>
                    </div>
                    
                    <div className="flex justify-center -my-2 relative z-10 opacity-50">
                       <div className="bg-brand-100 p-1.5 rounded-full dark:bg-brand-500/20">
                          <ArrowDown size={14} className="text-brand-600 dark:text-brand-500" />
                       </div>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="flex-1 bg-white/50 dark:bg-black/20 border border-light-border dark:border-dark-border rounded-xl px-4 py-3 flex items-center justify-between">
                         <span className="font-bold text-slate-400 text-sm mr-2 uppercase select-none">{selectedCoin.symbol}</span>
                         <div className="text-right font-mono font-bold text-lg text-brand-600 dark:text-brand-400 truncate pl-2">
                            {(parseFloat(usdInput || 0) / selectedCoin.current_price).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 mb-2">
                       <TrendingUp size={16} />
                       <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest">24h Peak</span>
                    </div>
                    <div className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-400 truncate">
                      ${selectedCoin.high_24h?.toLocaleString() ?? 'N/A'}
                    </div>
                  </div>
                  
                  <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-500 mb-2">
                       <TrendingDown size={16} />
                       <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest">24h Floor</span>
                    </div>
                    <div className="font-mono text-lg font-bold text-rose-700 dark:text-rose-400 truncate">
                      ${selectedCoin.low_24h?.toLocaleString() ?? 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-dark-surface border border-light-border dark:border-dark-border shadow-sm">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 mb-4 uppercase tracking-widest">
                    <Info size={16} /> Market Metrics
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-light-border dark:border-dark-border">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Market Rank</span>
                      <span className="font-mono font-bold bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg">
                        #{selectedCoin.market_cap_rank}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-light-border dark:border-dark-border">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Total Volume</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-200 truncate pl-4">
                        ${selectedCoin.total_volume?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0 pr-4">Circulating Supply</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-200 truncate">
                        {selectedCoin.circulating_supply.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
              
              <div className="p-6 border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shrink-0">
                 <button 
                  onClick={() => toggleWatchlist(selectedCoin.id)}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    watchlist.includes(selectedCoin.id) 
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30 ring-2 ring-amber-300 dark:ring-amber-500/50' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                  }`}
                 >
                   <Star size={20} className={watchlist.includes(selectedCoin.id) ? "fill-current" : ""} />
                   {watchlist.includes(selectedCoin.id) ? "Remove from Watchlist" : "Add to Watchlist"}
                 </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}