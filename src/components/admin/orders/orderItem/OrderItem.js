import React from "react";

import styles from "./orderItem.module.scss";
import BtnBlock from "../../../btnBlock/BtnBlock";

const OrderItem = ({ filteredOrders, setOrders, setError, formatDate }) => {
  // Функция для корректного склонения слова "час"
  const getHourText = (hours) => {
    if (hours === 1) return "час";
    if (hours >= 2 && hours <= 4) return "часа";
    return "часов";
  };

  const durationToText = (step) => {
    const hours = Math.floor(step / 2);
    const minutes = (step % 2) * 30;

    let result = "";

    if (hours > 0) {
      result += `${hours} ${getHourText(hours)}`;
    }
    if (minutes > 0) {
      result += ` ${minutes} минут`;
    }

    return result.trim();
  };

  const acceptOrder = async (order) => {
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        id: order.record.id,
        status: 100,
      })
    );

    try {
      const response = await fetch(`https://api.salon-era.ru/records/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка http! статус: ${response.status}, сообщение: ${errorText}`
        );
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.record.id === updatedOrder.id ? updatedOrder : o
        )
      );
    } catch (error) {
    } finally {
      window.location.reload();
    }
  };

  const closeOrder = async (order) => {
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        id: order.record.id,
        status: 500,
      })
    );

    try {
      const response = await fetch(`https://api.salon-era.ru/records/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка http! статус: ${response.status}, сообщение: ${errorText}`
        );
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.record.id === updatedOrder.id ? updatedOrder : o
        )
      );
    } catch (error) {
    } finally {
      window.location.reload();
    }
  };

  const cancelOrder = async (order) => {
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        id: order.record.id,
        status: 400,
      })
    );

    try {
      const response = await fetch(`https://api.salon-era.ru/records/update`, {
        method: "POST",

        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка http! статус: ${response.status}, сообщение: ${errorText}`
        );
      }
      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.record.id === updatedOrder.id ? updatedOrder : o
        )
      );
    } catch (error) {
      setError(error.message || "Неизвестная ошибка");
    } finally {
      window.location.reload();
    }
  };

  const groupOrdersByDate = (orders) => {
    return orders.reduce((acc, order) => {
      if (order.record?.status !== 400 && order.record?.status !== 500) {
        const date = formatDate(order.record?.dateRecord).split(",")[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(order);
      }
      return acc;
    }, {});
  };

  const groupedOrders = groupOrdersByDate(filteredOrders);

  return (
    <div>
      {Object.keys(groupedOrders).length > 0 ? (
        Object.keys(groupedOrders).map((date) => (
          <div className={styles["order-item"]} key={date}>
            <h2 className={styles.date}>{date}</h2>
            <ul className={styles["record-list"]}>
              {groupedOrders[date].map((order, index) => (
                <li
                  className={styles["record-item"]}
                  key={`${order.record?.id}-${index}`}
                >
                  <div className={styles["record-item__inner"]}>
                    <strong>Клиент:</strong>
                    <div>
                      {order.clientFrom
                        ? `${order.clientFrom?.firstName} ${order.clientFrom?.lastName}`
                        : "Неизвестный клиент"}
                    </div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Парикмахер:</strong>
                    <div>
                      {order.clientTo
                        ? `${order.clientTo?.firstName} ${order.clientTo?.lastName}`
                        : "Неизвестный парикмахер"}
                    </div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Услуга:</strong>
                    <div>
                      {order.service
                        ? order.service?.name
                        : "Неизвестная услуга"}
                    </div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Описание:</strong>
                    <div>
                      {order.service
                        ? order.service?.description
                        : "Нет описания"}
                    </div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Цена:</strong>
                    <div>
                      {order.service
                        ? `${order.service?.priceLow} р.`
                        : "Цена недоступна"}
                    </div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Дата:</strong>
                    <div>{formatDate(order.record?.dateRecord)}</div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Длительность:</strong>
                    <div>{durationToText(order.service?.duration)}</div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Статус:</strong>
                    {order.record?.status === 0 ? (
                      <div className={styles["order-created"]}>
                        Заказ создан
                      </div>
                    ) : (
                      <div className={styles["order-accepted"]}>
                        Заказ принят
                      </div>
                    )}
                  </div>
                  {order.record?.status === 0 ? (
                    <BtnBlock
                      className1={styles["g-btn"]}
                      className2={styles["r-btn"]}
                      className4={styles["btn-block"]}
                      label1="Принять заказ"
                      label2="Отменить заказ"
                      fnc1={() => acceptOrder(order)}
                      fnc2={() => cancelOrder(order)}
                    />
                  ) : (
                    <BtnBlock
                      className1={styles["gr-btn"]}
                      className2={styles["r-btn"]}
                      className4={styles["btn-block"]}
                      label1="Закрыть заказ"
                      label2="Отменить заказ"
                      fnc1={() => closeOrder(order)}
                      fnc2={() => cancelOrder(order)}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className={styles.message}>Заказов нет</p>
      )}
    </div>
  );
};

export default OrderItem;
