import styles from "./page.module.css";
import AppBar from "@/components/app-bar/app-bar";
import TrackerContainer from "@/containers/tracker-container/tracker-container";

export default function Home() {
  return (
    <div className={styles.page}>
      <AppBar title="Биржевой монитор" />
      <TrackerContainer />
    </div>
  );
}
