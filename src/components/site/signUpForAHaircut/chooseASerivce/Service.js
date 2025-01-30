import React from "react";
import styles from "./chooseAService.module.scss";

const Service = ({
  groupedServices,
  genderKey,
  category,
  toggleChooseService,
  selectedServices,
  getDurationText,
}) => {
  return (
    <div className={styles.wrapper}>
      {groupedServices[genderKey][category].map((item) => (
        <div className={styles["priceList-inner"]} key={item.id}>
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
                <div className={styles.clarify}>Уточни у сотрудника!</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Service;
