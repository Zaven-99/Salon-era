import React from "react";

import styles from "./recordList.module.scss";
import CustomButton from '../../../customButton/CustomButton';

const RecordList = ({
  filterOrdersByDate,
  visibleOrdersCount,
  date,
  formatDate,
  setVisibleOrdersCount,
}) => {
  const handleLoadMore = (date) => {
    setVisibleOrdersCount((prevCount) => ({
      ...prevCount,
      [date]: prevCount[date] + 5,
    }));
  };
  return (
    <ul className={styles["record-list"]}>
      {filterOrdersByDate()
        [date].slice(0, visibleOrdersCount[date] || 0)
        .map((order) => (
          <li key={order.record.id} className={styles["record-item"]}>
            <div className={styles["record-item__inner"]}>
              <strong>Клиент:</strong>
              <div>
                {order.clientFrom
                  ? `${order.clientFrom.firstName} ${order.clientFrom.lastName}`
                  : "Неизвестный клиент"}
              </div>
            </div>
            <div className={styles["record-item__inner"]}>
              <strong>Парикмахер:</strong>
              <div>
                {order.clientTo
                  ? `${order.clientTo.firstName} ${order.clientTo.lastName}`
                  : "Неизвестный парикмахер"}
              </div>
            </div>
            <div className={styles["record-item__inner"]}>
              <strong>Услуга:</strong>
              <div>
                {order.service ? order.service.name : "Неизвестная услуга"}
              </div>
            </div>
            <div className={styles["record-item__inner"]}>
              <strong>Описание:</strong>
              <div>
                {order.service ? order.service.description : "Нет описания"}
              </div>
            </div>
            <div className={styles["record-item__inner"]}>
              <strong>Цена:</strong>
              <div>
                {order.service
                  ? `${order.service.priceLow} р.`
                  : "Цена недоступна"}
              </div>
            </div>
            <div className={styles["record-item__inner"]}>
              <strong>Дата:</strong>
              <div>{formatDate(order.record.dateRecord)}</div>
            </div>
            <div className={styles.wrapper}>
              <strong>Статус:</strong>
              {order.record.status === 500 ? (
                <div className={styles[`order-closed`]}>Заказ закрыт</div>
              ) : order.record.status === 400 ? (
                <div className={styles[`order-canceled`]}>Заказ отменен</div>
              ) : order.record.status === 0 ? (
                <div className={styles[`order-created`]}>Заказ создан</div>
              ) : order.record.status === 100 ? (
                <div className={styles[`order-accept`]}>Заказ принят</div>
              ) : null}
            </div>
          </li>
        ))}
      {filterOrdersByDate()[date].length > (visibleOrdersCount[date] || 0) && (
        <CustomButton
          label="Загрузить еще"
          className={styles["load-more"]}
          onClick={() => handleLoadMore(date)}
        />
      )}
    </ul>
  );
};

export default RecordList;
