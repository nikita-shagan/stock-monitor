import styles from "./preloader.module.css";

function Preloader({ size = 52 }) {
  return (
    <div className={styles.preloader}>
      <div
        className={styles.preloaderWheel}
        style={{ width: size, height: size }}
      />
    </div>
  );
}

export default Preloader;
