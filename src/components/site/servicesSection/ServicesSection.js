import React from 'react';
import { service } from "../../../storage/API";

import styles from "./servicesSection.module.scss";
import logo from "../../../img/logo.png";



const ServicesSection = () => {
	return (
    <section className={styles["services-section"]}>
      <img className={styles.logo} src={logo} alt="" />
      <h1 className={styles["popular-serivces"]}>Популярные услуги</h1>
      <div className={styles.services}>
        {service.map((item) => (
          <div key={item.id} className={styles["services-item"]}>
            <img className={styles.icon} src={item.img} alt="" />
            <p className={styles["about-services"]}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;