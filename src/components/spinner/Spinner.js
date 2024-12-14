import React from "react";
import styles from "./spinner.module.scss";

import loadingGIF from "../../img/icons/loadingGIF.gif";

const Spinner = () => {
  return (
    <div className={styles['modal-overlay']}>
      <div className={styles["modal-content"]}>
        <img className={styles.GIF} src={loadingGIF} alt="Загрузка..." />
      </div>
    </div>
  );
};

export default Spinner;
