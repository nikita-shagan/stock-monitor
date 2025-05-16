import styles from "./stack.module.css";
import { ReactNode } from "react";

export default function Stack(props: { children: ReactNode }) {
  return <div className={styles.stack}>{props.children}</div>;
}
