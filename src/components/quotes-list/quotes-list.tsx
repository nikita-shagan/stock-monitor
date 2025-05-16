import React from "react";
import { FixedSizeList as List } from "react-window";
import styles from "./quotes-list.module.css";
import QuoteItem from "@/components/quote-item/quote-item";
import { QuoteModel } from "@/store/quotes/quotes-slice";

export default function QuotesList(props: {
  quotes: QuoteModel[];
  onQuoteClick: (quote: QuoteModel) => void;
}) {
  return (
    <div className={styles.quotesList}>
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
    </div>
  );
}
