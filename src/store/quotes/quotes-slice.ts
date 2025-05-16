import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiTwelvedataService from "@/services/api/services/api-twelvedata-service";
import { StreamTwelvedataService } from "@/services/api/services/stream-twelvedata-service";
import { PriceUpdateDto } from "@/services/api/dto/price-update";

export type QuoteModel = {
  symbol: string;
  price: string;
  currency: string;
  percentChange: string;
};

interface QuotesState {
  quotes: Record<string, QuoteModel>;
  areQuotesLoading: boolean;
}

const initialState: QuotesState = {
  quotes: {},
  areQuotesLoading: true,
};

const API_KEY = process.env.NEXT_PUBLIC_TWELVEDATA_API_KEY;
const PRICES_SOCKET_URL = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${API_KEY}`;
export const streamTwelvedataPricesService =
  new StreamTwelvedataService<PriceUpdateDto>(PRICES_SOCKET_URL);

export const updateQuotesPrices = createAsyncThunk<
  { symbol: string; price: string }[] | null,
  PriceUpdateDto[]
>("quotes/updateQuotes", async (updates) => {
  try {
    return updates
      .filter((update) => update.event === "price" && update.price)
      .map((update) => ({
        symbol: update.symbol,
        price: update.price?.toString(),
      }));
  } catch (e) {
    console.log(e);
    return null;
  }
});

export const fetchQuotes = createAsyncThunk<
  Record<string, QuoteModel> | null,
  string
>("quotes/fetchQuotes", async (symbolsToFetch, { dispatch }) => {
  try {
    const quotesDto = await apiTwelvedataService.getQuotes(symbolsToFetch);
    streamTwelvedataPricesService.subscribe(symbolsToFetch).catch(console.log);
    streamTwelvedataPricesService.setFlushCallback((quotes) =>
      dispatch(updateQuotesPrices(quotes)),
    );
    return Object.keys(quotesDto).reduce<Record<string, QuoteModel>>(
      (prev, cur) => {
        const quoteDto = quotesDto[cur];
        prev[cur] = {
          symbol: quoteDto.symbol,
          price: quoteDto.close,
          currency: quoteDto.currency,
          percentChange: quoteDto.percent_change,
        };
        return prev;
      },
      {},
    );
  } catch (e) {
    console.log(e);
    return null;
  }
});

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchQuotes.pending, (state) => {
      state.areQuotesLoading = true;
    });
    builder.addCase(fetchQuotes.fulfilled, (state, action) => {
      state.areQuotesLoading = false;
      if (action.payload !== null) {
        state.quotes = action.payload;
      }
    });
    builder.addCase(updateQuotesPrices.fulfilled, (state, action) => {
      if (action.payload) {
        action.payload.forEach((quote) => {
          if (
            state.quotes[quote.symbol] &&
            state.quotes[quote.symbol]?.price !== quote.price
          ) {
            state.quotes[quote.symbol].price = quote.price;
          }
        });
      }
    });
  },
});

export const quotesReducer = quotesSlice.reducer;
