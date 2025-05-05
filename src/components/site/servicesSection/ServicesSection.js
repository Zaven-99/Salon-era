import React, {useEffect} from 'react';
import { service } from "../../../storage/API";
import AOS from "aos";  

import styles from "./servicesSection.module.scss";
import logo from "../../../img/logo.png";

const ServicesSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 500,
    });
  }, []);
	return (
    <section data-aos="fade-zoom-in" className={styles["services-section"]}>
      <img className={styles.logo} src={logo} alt="" />
      <h1 className={styles["popular-serivces"]}>Популярные услуги</h1>
      <div className={styles.services}>
        {service.map((item) => (
          <div
            data-aos="fade-right"
            key={item.id}
            className={styles["services-item"]}
          >
            <img className={styles.icon} src={item.img} alt="" />
            <p className={styles["about-services"]}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;