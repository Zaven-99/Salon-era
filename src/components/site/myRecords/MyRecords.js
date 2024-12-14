import React, { useEffect, useState } from "react";
import { useAuth } from "../../../use-auth/use-auth";
import CustomButton from "../../customButton/CustomButton";
import Spinner from '../../spinner/Spinner';

import styles from "./myRecords.module.scss";

const MyRecords = () => {
  const [order, setOrder] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id: clientId } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://95.163.84.228:6533/records/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Полученные данные не являются массивом");
      }

      const userOrders = data.filter(
        (order) => order.clientFrom?.id === clientId
      );
      setOrder(userOrders);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const cancelOrder = async (order) => {
    setLoading(true);
    if (!order || !order.record || !order.record.id) {
      setError("Некорректные данные для отмены заказа");
      return;
    }

    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify({
        id: order.record.id,
        status: "Заказ отменен",
      })
    );

    try {
      const response = await fetch(`http://95.163.84.228:6533/records/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка HTTP! статус: ${response.status}, сообщение: ${errorText}`
        );
      }

      const updatedOrder = await response.json();
      setOrder((prevOrders) =>
        prevOrders.map((o) =>
          o.record.id === updatedOrder.id ? updatedOrder : o
        )
      );
    } catch (error) {
      setError(error.message || "Неизвестная ошибка");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
    };
    return new Date(date).toLocaleString("ru-RU", options);
  };

  const totalAllOrders = order.reduce(
    (acc, current) => acc + (current.service?.priceLow || 0),
    0
  );

  const totalCancelledOrders = order
    .filter((orderItem) => orderItem.record?.status === "Заказ отменен")
    .reduce((acc, current) => acc + (current.service?.priceLow || 0), 0);

  const total = totalAllOrders - totalCancelledOrders;

  if (loading) {
    return (
       <Spinner />
    );
  }

  return (
    <div className={styles["myRecords"]}>
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
      <h1>Мои заказы</h1>

      <h2 className={styles.total}>Общая сумма: {total} руб.</h2>

      {order.length > 0 ? (
        <ul className={styles["records-list"]}>
          {order.map((order) => {
            if (!order?.record) {
              return (
                <li key={order.id} className={styles["records-list__item"]}>
                  <p>Ошибка: отсутствует информация о заказе</p>
                </li>
              );
            }

            return (
              <li key={order.id} className={styles["records-list__item"]}>
                <p>
                  <strong>Номер заказа:</strong> {order.record.number}
                </p>
                <p>
                  <strong>Парикмахер:</strong>
                  <span>{order.clientTo?.firstName}&nbsp;</span>
                  <span>{order.clientTo?.lastName}</span>
                </p>

                {order.record?.status === "Заказ создан" ? (
                  <div className={styles.status}>
                    <strong>Статус:</strong>
                    <div className={styles.created}>{order.record?.status}</div>
                  </div>
                ) : order.record?.status === "Заказ отменен" ? (
                  <div className={styles.status}>
                    <strong>Статус:</strong>{" "}
                    <div className={styles.canceled}>
                      {order.record?.status}
                    </div>
                  </div>
                ) : (
                  <div className={styles.status}>
                    <strong>Статус:</strong>{" "}
                    <div className={styles.closed}>{order.record?.status}</div>
                  </div>
                )}

                <p>
                  <strong>Дата заказа:</strong>
                  {formatDate(order.record.dateRecord)}
                </p>
                <p>
                  <strong>Стоимость:</strong>
                  {order.service?.priceLow} руб.
                </p>
                {order.record?.status !== "Заказ отменен" &&
                order.record?.status !== "Заказ принят" ? (
                  <CustomButton
                    label="Отменить"
                    onClick={() => cancelOrder(order)}
                    className={styles.cancel}
                    type="submit"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.empty}>Заказы отсутствуют.</p>
      )}
    </div>
  );
};

export default MyRecords;
