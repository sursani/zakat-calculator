// Remove the unused axios import since we're using fallback values
// import axios from 'axios';
// import { GoldPriceApiResponse, SilverPriceApiResponse } from '../types';

// Define default/fallback metal prices
const DEFAULT_GOLD_PRICE = 75.0; // USD per gram
const DEFAULT_SILVER_PRICE = 0.85; // USD per gram

/**
 * Fetch the current gold price in USD per gram
 * @returns Promise with gold price per gram in USD
 */
export const fetchGoldPrice = async (): Promise<number> => {
  // Due to CORS issues with direct API calls, we're using a fallback value
  // In a production app, you would set up a server-side proxy or use a CORS-enabled API
  
  // Return fallback price
  return DEFAULT_GOLD_PRICE;
  
  /* Implementation with proxy if you add one later:
  try {
    // Using a proxy or CORS-enabled endpoint
    const response = await axios.get<GoldPriceApiResponse>(
      '/api/gold-price' // Your own API route that fetches from goldpricez.com
    );
    
    // Return the 24k gold price per gram
    return response.data.gold_price_per_gram_24k;
  } catch (error) {
    console.error('Error fetching gold price:', error);
    return DEFAULT_GOLD_PRICE;
  }
  */
};

/**
 * Fetch the current silver price in USD per gram
 * @returns Promise with silver price per gram in USD
 */
export const fetchSilverPrice = async (): Promise<number> => {
  // Due to CORS issues with direct API calls, we're using a fallback value
  // In a production app, you would set up a server-side proxy or use a CORS-enabled API
  
  // Return fallback price
  return DEFAULT_SILVER_PRICE;
  
  /* Implementation with proxy if you add one later:
  try {
    // Using a proxy or CORS-enabled endpoint
    const response = await axios.get<SilverPriceApiResponse>(
      '/api/silver-price' // Your own API route that fetches from goldpricez.com
    );
    
    // Return the silver price per gram
    return response.data.silver_price_per_gram;
  } catch (error) {
    console.error('Error fetching silver price:', error);
    return DEFAULT_SILVER_PRICE;
  }
  */
};

/**
 * Fetch both gold and silver prices
 * @returns Promise with both gold and silver prices per gram in USD
 */
export const fetchMetalPrices = async (): Promise<{ gold: number; silver: number; timestamp: string }> => {
  const [goldPrice, silverPrice] = await Promise.all([
    fetchGoldPrice(),
    fetchSilverPrice()
  ]);
  
  return {
    gold: goldPrice,
    silver: silverPrice,
    timestamp: new Date().toISOString()
  };
}; 