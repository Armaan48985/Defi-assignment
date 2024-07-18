import { CoinList, HistoricalChart, SingleCoin, TrendingCoins } from "@/config/api";

export const fetchChartData = async (coin: string, days : number): Promise<number[][]> => {
  try {
    const data = await fetch(HistoricalChart(coin, days, "INR")).then(res => res.json());
    if (data) {
      return data.prices;
    }
  } catch (error) {
    console.error("Error fetching chart data: ", error);
  }
  return [];
};

export const fetchCoins = async (): Promise<any[]> => {
  try {
    const data = await fetch(CoinList("INR")).then(res => res.json());
    if (data) {
      return data;
    }
  } catch (error) {
    console.error("Error fetching coins: ", error);
  }
  return [];
};

export const fetchSingleCoin = async (coin: string): Promise<any> => {
  try {
    const data = await fetch(SingleCoin(coin)).then(res => res.json());
    if (data) {
      return data;
    }
  } catch (error) {
    console.error("Error fetching single coin: ", error);
  }
  return null;
};

export const fetchTrendingCoins = async (): Promise<any[]> => {
  try {
    const data = await fetch(TrendingCoins("INR")).then(res => res.json());
    if (data) {
      return data;
    }
  } catch (error) {
    console.error("Error fetching trending coins: ", error);
  }
  return [];
};

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}