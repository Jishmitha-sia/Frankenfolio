import { useState, useEffect } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('frankenfolio_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('frankenfolio_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (coinId) => {
    setWatchlist(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId) 
        : [...prev, coinId]
    );
  };

  return { watchlist, toggleWatchlist };
}