import React from "react";
import styles from "./spinner.module.scss";

import loadingGIF from "../../img/icons/loadingGIF.gif";

const Spinner = () => {
  return (
    <div className={styles["modal-overlay"]}>
      <img className={styles.GIF} src={loadingGIF} alt="Загрузка..." />
    </div>
  );
};

export default Spinner;
