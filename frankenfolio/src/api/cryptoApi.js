const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchTopCoins = async (limit = 10) => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error("You appear to be offline. Please check your network connection.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true`
    );

    if (response.status === 429) {
      throw new Error("API Rate Limit reached. Please wait a moment and try again.");
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch market data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error("Network error. Please check your internet connection or try again later.");
    }
    throw error;
  }
};

export const fetchGlobalData = async () => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error("You appear to be offline.");
  }

  try {
    const response = await fetch(`${BASE_URL}/global`);
    
    if (response.status === 429) {
      throw new Error("API Rate Limit reached.");
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch global data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};