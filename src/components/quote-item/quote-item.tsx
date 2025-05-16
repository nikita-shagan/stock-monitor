import styles from "./quote-item.module.css";
import cx from "classnames";
import { QuoteModel } from "@/store/tracker/tracker-slice";

export default function QuoteItem(props: {
  quote: QuoteModel;
  onClick?: (quote: QuoteModel) => void;
}) {
  return (
    <li
      className={styles.quoteItem}
      onClick={() => props.onClick?.(props.quote)}
    >
      <p>{props.quote?.symbol}</p>
      <p>
        {props.quote?.price} {props.quote?.currency}
      </p>
      <p
        className={cx(styles.quoteItemPercent, {
          [styles.quoteItemPercent_negative]:
            props.quote?.percentChange?.startsWith("-"),
        })}
      >
        {props.quote?.percentChange}%
      </p>
    </li>
  );
}
