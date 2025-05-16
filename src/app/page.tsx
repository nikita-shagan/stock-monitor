import styles from "./page.module.css";
import AppBar from "@/components/app-bar/app-bar";
import QuotesContainer from "@/containers/quotes-container/quotes-container";

export default function Home() {
  return (
    <div className={styles.page}>
      <AppBar title="Биржевой монитор" />
      <QuotesContainer />
    </div>
  );
}
