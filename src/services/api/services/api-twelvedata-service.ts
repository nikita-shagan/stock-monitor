import { request } from "@/services/api/core/request";
import { QuoteDto } from "@/services/api/dto/quote-dto";

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
}

const apiTwelvedataService = new ApiTwelvedataService();
export default apiTwelvedataService;
