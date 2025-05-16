import styles from "./dialog.module.css";
import { MouseEvent, ReactNode } from "react";
import cx from "classnames";
import Image from "next/image";
import close from "@/lib/images/close.svg";

export default function Dialog(props: {
  isOpened: boolean;
  onClose: () => void;
  children?: ReactNode;
}) {
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <div
      className={cx(styles.dialog, { [styles.dialogOpened]: props.isOpened })}
      onClick={handleOverlayClick}
    >
      <div className={styles.dialogBody}>
        <Image
          className={styles.dialogBodyClose}
          src={close}
          alt="close"
          onClick={props.onClose}
        />
        {props.children}
      </div>
    </div>
  );
}
