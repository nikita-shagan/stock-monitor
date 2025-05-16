import styles from "./app-bar.module.css";

export default function AppBar(props: { title: string }) {
  return (
    <div className={styles.appBar}>
      <div className={styles.appBarBody}>
        <h1 className={styles.appBarBodyTitle}>{props.title}</h1>
      </div>
    </div>
  );
}
