export interface MacdDto {
  values: {
    datetime: string;
    macd: string;
    macd_signal: string;
    macd_hist: string;
  }[];
}
