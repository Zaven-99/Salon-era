import React, { useEffect, useState } from "react";
import { useAuth } from "../../../use-auth/use-auth";
import CustomButton from "../../customButton/CustomButton";
import Spinner from "../../spinner/Spinner";

import styles from "./myRecords.module.scss";

const MyRecords = () => {
  const [order, setOrder] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id: clientId } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/records/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`http error! status: ${response.status}`);
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
    .filter((orderItem) => orderItem.record?.status === 400)
    .reduce((acc, current) => acc + (current.service?.priceLow || 0), 0);

  const total = totalAllOrders - totalCancelledOrders;

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["myRecords"]}>
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
      <h1>Мои заказы</h1>

      <h2 className={styles.total}>Общая сумма: {total} руб.</h2>

      {order.length > 0 ? (
        <ul className={styles["records-list"]}>
          {order.map((order, index) => {
            if (!order?.record) {
              return (
                <li key={index} className={styles["records-list__item"]}>
                  <p>Ошибка: отсутствует информация о заказе</p>
                </li>
              );
            }

            return (
              <li key={index} className={styles["records-list__item"]}>
                <div>
                  <strong>Номер заказа:</strong>{" "}
                  <span>{order.record.number}</span>
                </div>
                <div>
                  <strong>Парикмахер:</strong>
                  <span>{order.clientTo?.firstName}&nbsp;</span>
                  <span>{order.clientTo?.lastName}</span>
                </div>
                {order.record?.status === 0 ? (
                  <div className={styles.status}>
                    <strong>Статус:</strong>
                    <span className={styles.created}>Заказ создан</span>
                  </div>
                ) : order.record?.status === 400 ? (
                  <div className={styles.status}>
                    <strong>Статус:</strong>{" "}
                    <span className={styles.canceled}>Заказ отменен</span>
                  </div>
                ) : order.record?.status === 100 ? (
                  <div className={styles.status}>
                    <strong>Статус:</strong>{" "}
                    <span className={styles.accept}>Заказ принят</span>
                  </div>
                ) : (
                  <div className={styles.status}>
                    <strong>Статус:</strong>{" "}
                    <span className={styles.closed}>Заказ закрыт</span>
                  </div>
                )}
                <div>
                  <strong>Дата заказа:</strong>
                  <span>{formatDate(order.record.dateRecord)}</span>
                </div>

                <div>
                  <strong>Стоимость:</strong>
                  <span>{order.service?.priceLow} руб.</span>
                </div>
                {order.record?.status === 0 ? (
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
