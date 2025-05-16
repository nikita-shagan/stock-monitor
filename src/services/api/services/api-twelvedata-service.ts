import { request } from "@/services/api/core/request";
import { QuoteDto } from "@/services/api/dto/quote-dto";
import { TimeSeriesDto } from "@/services/api/dto/time-series-dto";
import { RsiDto } from "@/services/api/dto/rsi-dto";
import { MacdDto } from "@/services/api/dto/macd-dto";

const URL = "https://api.twelvedata.com";
const API_KEY = process.env.NEXT_PUBLIC_TWELVEDATA_API_KEY ?? "";

class ApiTwelvedataService {
  public getQuotes(symbols: string) {
    return request<Record<string, QuoteDto>>(URL, "/quote", {
      params: {
        symbol: symbols,
        apikey: API_KEY,
      },
    });
  }

  public getTimeSeries(symbol: string, interval: string, outputsize: string) {
    return request<TimeSeriesDto>(URL, "/time_series", {
      params: {
        symbol,
        interval,
        outputsize,
        apikey: API_KEY,
      },
    });
  }

  public getRsi(symbol: string, interval: string, outputsize: string) {
    return request<RsiDto>(URL, "/rsi", {
      params: {
        symbol,
        interval,
        outputsize,
        apikey: API_KEY,
      },
    });
  }

  public getMacd(symbol: string, interval: string, outputsize: string) {
    return request<MacdDto>(URL, "/macd", {
      params: {
        symbol,
        interval,
        outputsize,
        apikey: API_KEY,
      },
    });
  }
}

const apiTwelvedataService = new ApiTwelvedataService();
export default apiTwelvedataService;
