import React, {useEffect} from "react";
import AOS from "aos"; // импортируем AOS

import styles from "./service.module.scss";

const Service = ({
  groupedServices,
  genderKey,
  category,
  toggleChooseService,
  selectedServices,
  getDurationText,
}) => {

  useEffect(() => {
        AOS.init({
          duration: 500,
          once: false,
          offset: 10,
        });
      }, []);
  return (
    <div className={styles.wrapper}>
      {groupedServices[genderKey][category].map((item) => (
        <div
          data-aos="fade-up"
          className={styles["priceList-inner"]}
          key={item.id}
        >
          <div
            onClick={() => toggleChooseService(item)}
            className={`${styles["priceList-inner_item"]} ${
              selectedServices.some((s) => s.id === item.id)
                ? styles.selectedService
                : ""
            }`}
          >
            <p>Название: {item.name}</p>
            <p>{item.description && <>Описание: {item.description}</>}</p>
            <p>Продолжительность: {getDurationText(item.duration)}</p>
            <div>
              Цена:{" "}
              {item.priceMax === null
                ? `${item.priceLow} руб.`
                : `${item.priceLow} - ${item.priceMax} руб.`}
              {item.priceLow && item.priceMax && (
                <div className={styles.clarify}>Уточнить у мастера!</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Service;
