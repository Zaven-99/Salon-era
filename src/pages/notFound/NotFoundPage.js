import React from "react";
import styles from "./notFound.module.scss";
import logo from '../../img/logo.png'
const NotFoundPage = () => {
  return (
    <div className={styles['not-found-page']}> 
      <h1 className={styles["not-found"]}>404</h1>
	  <img className={styles.logo} src={logo} alt="" />
      <p className={styles.text}>Упс! страница не найдена...</p>
      <p className={styles.text}>
        Возможно, вы перешли по неверной ссылке или страница была удалена.
      </p>
      <a className={styles["to-home"]} href="/">
        Вернуться на главную
      </a>
    </div>
  );
};

export default NotFoundPage;
