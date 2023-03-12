export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: string;
  price_change_percentage_24h: string;
  market_cap: {};
  fully_diluted_valuation: {};
  circulating_supply: string;
  total_supply: string;
  max_supply: string;
  description: {
    [key: string]: string;
  };
}

export type Option = {
  key: string;
  value: string;
};

export interface SingleCoinData {
  id: string;
  symbol: string;
  name: string;
  image: { [key: string]: string };
  market_data: {
    current_price: { [key: string]: string };
    market_cap: { [key: string]: string };
    price_change_percentage_24h: string;
    fully_diluted_valuation: { [key: string]: string };
    circulating_supply: string;
    total_supply: string;
    max_supply: string;
  };

  description: {
    [key: string]: string;
  };
}
