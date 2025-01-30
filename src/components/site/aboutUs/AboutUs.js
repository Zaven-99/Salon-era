import React from "react";
import styles from "./aboutUs.module.scss";
import Employee from "../employee/Employee";

const AboutUs = () => {
  return (
    <div className={styles["aboutUs-block"]}>
      <Employee />
      <div className={styles["aboutUs"]}>
        <h1 className={styles.title}>
          В салоне красоты ЭРА мы заботимся о том, чтобы каждый наш клиент
          чувствовал себя комфортно и был доволен своим внешним видом.
        </h1>
        <br />
        <h2>
          Мы предлагаем услуги, которые учитывают ваши предпочтения и стиль.
        </h2>
        <br />
        <h3>Для женщин мы предлагаем</h3>
        <ul>
          <li>
            Стрижки и укладки, которые подчеркивают ваш стиль и
            индивидуальность,
          </li>
          <li>Профессиональное окрашивание и колорирование волос,</li>
          <li>Укладки и стайлинг, чтобы создать завершенный образ,</li>
          <li>
            Маникюр и уход за кожей рук, чтобы руки всегда выглядели ухоженно,
          </li>
          <li>
            Ламинирование и коррекцию бровей, чтобы выразительность взгляда
            стала яркой.
          </li>
        </ul>
        <br />
        <h3>Для детей мы предлагаем</h3>
        <ul>
          <li>
            Профессиональные стрижки, которые сделают вашего ребенка ухоженным и
            стильным,
          </li>
          <li>Яркие и креативные укладки, подходящие для детского возраста,</li>
          <li>
            Веселые и комфортные детские стрижки с учетом интересов и
            предпочтений,
          </li>
          <li>
            Особый подход к обслуживанию, чтобы сделать визит комфортным и
            приятным.
          </li>
        </ul>
        <br /> <h3>Для мужчин мы предлагаем</h3>
        <ul>
          <li>
            Уход за бородой, чтобы она всегда выглядела аккуратно и ухоженно.
          </li>
          <li>Стрижки и укладки бороды и усов,</li>
          <li>Коррекция и моделирование бровей,</li>
          <li>Укладки и стайлинг волос,</li>
          <li>Маникюр и уход за кожей рук.</li>
        </ul>
        <br />
        Каждый визит в ЭРА — это не просто услуга, а внимательное отношение к
        вашим желаниям и деталям. Мы стремимся создать для вас атмосферу, где
        можно расслабиться и довериться профессионалам, чтобы выйти из салона с
        отличным настроением и уверенными в своём образе.
      </div>
    </div>
  );
};

export default AboutUs;
