import { RootState } from "@/store/store";

export const selectQuotesState = (state: RootState) => state.quotes;
