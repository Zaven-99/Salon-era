import React from "react";

import styles from './serviceBlock.module.scss'

const ServiceBlock = ({ service, durationToText, getGenderText }) => {
  return (
    <div className={styles["service-block"]}>
      <div className={styles["service-item__inner"]}>
        <strong>Название услуги:</strong>
        <div>{service.name}</div>
      </div>
      <div className={styles["service-item__inner"]}>
        <strong>Цена:</strong>{" "}
        <div>
          {service.priceMax === null
            ? `${service.priceLow} руб.`
            : `${service.priceLow} - ${service.priceMax} руб.`}
        </div>
      </div>
      <div className={styles["service-item__inner"]}>
        <strong>Описание:</strong> <div>{service.description}</div>
      </div>
      <div className={styles["service-item__inner"]}>
        <strong>Продолжительность:</strong> <div>{durationToText(service.duration)}</div>
      </div>
      <div className={styles["service-item__inner"]}>
        <strong>Пол:</strong>
        <div> {getGenderText(service.gender)}</div>
      </div>
    </div>
  );
};

export default ServiceBlock;
