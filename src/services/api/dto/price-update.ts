export type PriceUpdateDto = {
  event: string;
  symbol: string;
  price: number;
  timestamp: number;
  currency_base: string;
  currency_quote: string;
  exchange: string;
  type: string;
};
