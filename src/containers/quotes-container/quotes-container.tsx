"use client";
import QuotesList from "@/components/quotes-list/quotes-list";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectQuotesState } from "@/store/quotes/selectors";
import { fetchQuotes, QuoteModel } from "@/store/quotes/quotes-slice";
import Dialog from "@/components/dialog/dialog";
import { SYMBOLS_EXAMPLE } from "@/utils/constants";
import Preloader from "@/components/preloader/preloader";
import Stack from "@/components/stack/stack";
import QuotesFilters, {
  QuotesFiltersType,
} from "@/components/quotes-filters/quotes-filters";

export default function QuotesContainer() {
  const dispatch = useAppDispatch();
  const { quotes, areQuotesLoading } = useAppSelector(selectQuotesState);
  const [filters, setFilters] = useState<QuotesFiltersType>({
    search: "",
    onlyNegative: false,
    onlyPositive: false,
  });
  const [quoteDetailed, setQuoteDetailed] = useState<QuoteModel | null>();

  useEffect(() => {
    dispatch(fetchQuotes(SYMBOLS_EXAMPLE));
  }, [dispatch]);

  if (areQuotesLoading) {
    return <Preloader />;
  }

  const quotesToRender = Object.values(quotes)
    .filter((quote) =>
      quote?.symbol?.toLowerCase()?.includes(filters?.search?.toLowerCase()),
    )
    .filter((quote) =>
      filters.onlyPositive ? !quote?.percentChange?.startsWith("-") : true,
    )
    .filter((quote) =>
      filters.onlyNegative ? quote?.percentChange?.startsWith("-") : true,
    );

  return (
    <Stack>
      <QuotesFilters filters={filters} onFiltersChange={setFilters} />
      <QuotesList
        quotes={quotesToRender}
        onQuoteClick={(currency) => setQuoteDetailed(currency)}
      />
      <Dialog isOpened={!!quoteDetailed} onClose={() => setQuoteDetailed(null)}>
        <div>{quoteDetailed?.symbol}</div>
      </Dialog>
    </Stack>
  );
}
