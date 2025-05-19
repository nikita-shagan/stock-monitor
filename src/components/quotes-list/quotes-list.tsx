import React from "react";
import { FixedSizeList as List } from "react-window";
import styles from "./quotes-list.module.css";
import QuoteItem from "@/components/quote-item/quote-item";
import { QuoteModel } from "@/store/tracker/tracker-slice";
import Preloader from "@/components/preloader/preloader";

export default function QuotesList(props: {
  quotes: QuoteModel[];
  onQuoteClick: (quote: QuoteModel) => void;
  isLoading?: boolean;
}) {
  return (
    <div className={styles.quotesList}>
      {props.isLoading ? (
        <Preloader />
      ) : (
        <List
          height={400}
          itemCount={props.quotes.length}
          itemSize={50}
          width="100%"
        >
          {({ index, style }) => {
            const quote = props.quotes[index];
            return (
              <div style={style}>
                <QuoteItem
                  key={quote?.symbol}
                  quote={quote}
                  onClick={props.onQuoteClick}
                />
              </div>
            );
          }}
        </List>
      )}
    </div>
  );
}
