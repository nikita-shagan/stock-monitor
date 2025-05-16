import styles from "./checkbox.module.css";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export default function Checkbox(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & {
    label: string;
  },
) {
  return (
    <div className={styles.checkbox}>
      <label className={styles.checkboxLabel}>
        {props.label}
        <input type="checkbox" className={styles.checkboxInput} {...props} />
      </label>
    </div>
  );
}
