import React, { useEffect } from "react";
import Employee from "../employee/Employee";
import AOS from "aos"; // импортируем AOS

import styles from "./aboutUs.module.scss";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 300,
    });
  }, []);

  return (
    <div className={styles["aboutUs-block"]}>
      <Employee />

      <div className={styles.aboutUsContainer}>
        <div
          className={`${styles.item} ${styles.background}`}
          data-aos="fade-right"
        >
          <span>
            В салоне красоты ЭРА мы заботимся о том, чтобы каждый наш клиент
            чувствовал себя комфортно и был доволен своим внешним видом.
          </span>
        </div>
        <div className={styles.item2} data-aos="fade-left">
          <span>
            Мы предлагаем услуги, которые учитывают ваши предпочтения и стиль.
          </span>
        </div>
        <div
          className={`${styles.item} ${styles.background1}`}
          data-aos="fade-right"
        >
          <h3>Для женщин мы предлагаем</h3>
          <ul>
            <li data-aos="fade-right">
              Стрижки и укладки, которые подчеркивают ваш стиль и
              индивидуальность,
            </li>
            <li data-aos="fade-right">
              Профессиональное окрашивание и колорирование волос,
            </li>
            <li data-aos="fade-right">
              Укладки и стайлинг, чтобы создать завершенный образ,
            </li>
            <li data-aos="fade-right">
              Маникюр и уход за кожей рук, чтобы руки всегда выглядели ухоженно,
            </li>
            <li data-aos="fade-right">
              Ламинирование и коррекцию бровей, чтобы выразительность взгляда
              стала яркой.
            </li>
          </ul>
        </div>

        <div
          className={`${styles.item2} ${styles.background2}`}
          data-aos="fade-left"
        >
          <h3>Для детей мы предлагаем</h3>
          <ul>
            <li data-aos="fade-left">
              Профессиональные стрижки, которые сделают вашего ребенка ухоженным
              и стильным,
            </li>
            <li data-aos="fade-left">
              Яркие и креативные укладки, подходящие для детского возраста,
            </li>
            <li data-aos="fade-left">
              Веселые и комфортные детские стрижки с учетом интересов и
              предпочтений,
            </li>
            <li data-aos="fade-left">
              Особый подход к обслуживанию, чтобы сделать визит комфортным и
              приятным.
            </li>
          </ul>
        </div>
        <div
          className={`${styles.item} ${styles.background3}`}
          data-aos="fade-right"
        >
          <h3>Для мужчин мы предлагаем</h3>
          <ul>
            <li data-aos="fade-right">
              Уход за бородой, чтобы она всегда выглядела аккуратно и ухоженно.
            </li>
            <li data-aos="fade-right">Стрижки и укладки бороды и усов,</li>
            <li data-aos="fade-right">Коррекция и моделирование бровей,</li>
            <li data-aos="fade-right">Укладки и стайлинг волос,</li>
            <li data-aos="fade-right">Маникюр и уход за кожей рук.</li>
          </ul>
        </div>
        <div className={styles.item2} data-aos="fade-left">
          <span>
            Каждый визит в ЭРА — это не просто услуга, а внимательное отношение
            к вашим желаниям и деталям. Мы стремимся создать для вас атмосферу,
            где можно расслабиться и довериться профессионалам, чтобы выйти из
            салона с отличным настроением и уверенными в своём образе.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
