import React from "react";
import { Link, NavLink } from "react-router-dom";

import logo from "../../../img/logo.png";
import telegram from "../../../img/social/telegram.png";
import instagram from "../../../img/social/instagram.png";
import scissors from "../../../img/footer/scissors.png";

import styles from "./footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img className={styles.logo} src={logo} alt="" />
      <h1 className={styles["contact-info"]}>
        Вы всегда можете связаться с нами{" "}
      </h1>
      <div className={styles["work-time__block"]}>
        <p className={styles["work-time"]}>
          Работаем каждый день с 10 до 20:00
        </p>
        <img className={styles.scissors} src={scissors} alt="" />
        <a className={styles.tel} href="tel:+79153030990">
          Позвонить нам
        </a>
      </div>

      <div className={styles.wrapper}>
        <p className={styles["copyright"]}>© Все права Защищены ЭРА</p>

        <NavLink to="/privacy-policy" className={styles.policy}>
          политика конфиденциальности
        </NavLink>

        <div className={styles["social-img"]}>
          <Link to="https://t.me/ERA030990">
            <img src={telegram} alt="" />
          </Link>
          <Link to="https://www.instagram.com/era_korolev?igsh=MWg1cDZyNmh4ZDVlbw==">
            <img src={instagram} alt="" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
