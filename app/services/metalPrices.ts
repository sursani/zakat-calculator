import axios from 'axios';
import { GoldPriceApiResponse, SilverPriceApiResponse } from '../types';

/**
 * Fetch the current gold price in USD per gram
 * @returns Promise with gold price per gram in USD
 */
export const fetchGoldPrice = async (): Promise<number> => {
  try {
    // Using GoldPriceZ.com API which is free with generous limits
    const response = await axios.get<GoldPriceApiResponse>(
      'https://www.goldpricez.com/api/rates/currency/usd/measure/gram'
    );
    
    // Return the 24k gold price per gram
    return response.data.gold_price_per_gram_24k;
  } catch (error) {
    console.error('Error fetching gold price:', error);
    
    // Fallback to a reasonable default if API fails
    // This is just a fallback and should be updated regularly
    return 75.0; // Approximate price per gram in USD
  }
};

/**
 * Fetch the current silver price in USD per gram
 * @returns Promise with silver price per gram in USD
 */
export const fetchSilverPrice = async (): Promise<number> => {
  try {
    // Using GoldPriceZ.com API which is free with generous limits
    const response = await axios.get<SilverPriceApiResponse>(
      'https://www.goldpricez.com/api/silver/currency/usd/measure/gram'
    );
    
    // Return the silver price per gram
    return response.data.silver_price_per_gram;
  } catch (error) {
    console.error('Error fetching silver price:', error);
    
    // Fallback to a reasonable default if API fails
    // This is just a fallback and should be updated regularly
    return 0.85; // Approximate price per gram in USD
  }
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