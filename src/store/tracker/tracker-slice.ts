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

export type TimeSeriesModel = {
  datetime: string;
  close: number;
};

export type RsiModel = {
  datetime: string;
  rsi: number;
};

export type MacdModel = {
  datetime: string;
  macd: number;
  macd_signal: number;
  macd_histogram: number;
};

interface TrackerState {
  quotes: Record<string, QuoteModel>;
  chartData: TimeSeriesModel[];
  rsiData: RsiModel[];
  macdData: MacdModel[];
  areQuotesLoading: boolean;
  isChartDataLoading: boolean;
}

const initialState: TrackerState = {
  quotes: {},
  chartData: [],
  rsiData: [],
  macdData: [],
  areQuotesLoading: false,
  isChartDataLoading: false,
};

const API_KEY = process.env.NEXT_PUBLIC_TWELVEDATA_API_KEY;
const PRICES_SOCKET_URL = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${API_KEY}`;
export const streamTwelvedataPricesService =
  new StreamTwelvedataService<PriceUpdateDto>(PRICES_SOCKET_URL);

export const updateQuotesPrices = createAsyncThunk<
  { symbol: string; price: string }[] | null,
  PriceUpdateDto[]
>("tracker/updateQuotes", async (updates) => {
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
>("tracker/fetchQuotes", async (symbolsToFetch, { dispatch }) => {
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

export const fetchChartData = createAsyncThunk<TimeSeriesModel[], string>(
  "tracker/fetchChartData",
  async (symbol) => {
    try {
      const res = await apiTwelvedataService.getTimeSeries(
        symbol,
        "1day",
        "30",
      );
      return res.values
        .map((item) => ({
          datetime: item.datetime,
          close: parseFloat(item.close),
        }))
        .reverse();
    } catch (e) {
      console.log(e);
      return [];
    }
  },
);

export const fetchRsiData = createAsyncThunk<RsiModel[], string>(
  "tracker/fetchRsiData",
  async (symbol) => {
    try {
      const res = await apiTwelvedataService.getRsi(symbol, "1day", "30");
      return res.values
        .map((item) => ({
          datetime: item.datetime,
          rsi: parseFloat(item.rsi),
        }))
        .reverse();
    } catch (e) {
      console.log(e);
      return [];
    }
  },
);

export const fetchMacdData = createAsyncThunk<MacdModel[], string>(
  "tracker/fetchMacdData",
  async (symbol) => {
    try {
      const res = await apiTwelvedataService.getMacd(symbol, "1day", "30");
      return res.values
        .map((item) => ({
          datetime: item.datetime,
          macd: parseFloat(item.macd),
          macd_signal: parseFloat(item.macd_signal),
          macd_histogram: parseFloat(item.macd_hist),
        }))
        .reverse();
    } catch (e) {
      console.log(e);
      return [];
    }
  },
);

const trackerSlice = createSlice({
  name: "tracker",
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
    builder.addCase(fetchChartData.pending, (state) => {
      state.isChartDataLoading = true;
      state.chartData = [];
    });
    builder.addCase(fetchChartData.fulfilled, (state, action) => {
      state.isChartDataLoading = false;
      state.chartData = action.payload;
    });
    builder.addCase(fetchRsiData.fulfilled, (state, action) => {
      state.rsiData = action.payload;
    });
    builder.addCase(fetchMacdData.fulfilled, (state, action) => {
      state.macdData = action.payload;
    });
  },
});

export const trackerReducer = trackerSlice.reducer;
