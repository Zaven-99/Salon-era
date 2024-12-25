import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";

import CustomButton from "../../customButton/CustomButton";
import Spinner from "../../spinner/Spinner.js";

import styles from "./order.module.scss";

registerLocale("ru", ru);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const durationMap = [
    "30 минут",
    "1 час",
    "1ч 30 минут",
    "2 часа",
    "2ч 30 минут",
    "3ч",
    "3ч 30 минут",
    "4ч",
  ];
  const getDurationText = (duration) => durationMap[duration - 1] || "";

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
        throw new Error(`Ошибка HTTP! статус: ${response.status}`);
      }

      const data = await response.json();
      data.sort(
        (a, b) => new Date(b.record.dateRecord) - new Date(a.record.dateRecord)
      );
      setOrders(data);

      setFilteredOrders(
        data.filter(
          (order) => order.record.status !== 400 && order.record.status !== 500
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const groupOrdersByDate = (orders) => {
    return orders.reduce((acc, order) => {
      if (order.record.status !== 400 && order.record.status !== 500) {
        const date = formatDate(order.record.dateRecord).split(",")[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(order);
      }
      return acc;
    }, {});
  };

  const formatDate = (date) => {
    const dateOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formattedDate = new Date(date).toLocaleDateString(
      "ru-RU",
      dateOptions
    );
    const formattedTime = new Date(date).toLocaleTimeString(
      "ru-RU",
      timeOptions
    );

    return `${formattedDate}, ${formattedTime}`;
  };

  const filterOrdersByDate = (date) => {
    if (!date) {
      const filtered = orders.filter(
        (order) => order.record.status !== 400 && order.record.status !== 500
      );
      setFilteredOrders(filtered);
    } else {
      const formattedDate = formatDate(date).split(",")[0];
      const filtered = orders.filter((order) => {
        return (
          formatDate(order.record.dateRecord).split(",")[0] === formattedDate &&
          order.record.status !== 400 &&
          order.record.status !== 500
        );
      });
      setFilteredOrders(filtered);
    }
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

  const groupedOrders = groupOrdersByDate(filteredOrders);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      {error && <p>Ошибка: {error}</p>}
      <h1 className={styles["orders-today"]}>Заказы на сегодня</h1>

      <div className={styles.datePickerWrapper}>
        <DatePicker
          className={styles["date-picker"]}
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            filterOrdersByDate(date);
          }}
          dateFormat="dd MMM yyyy"
          placeholderText="Выберите дату"
          isClearable
          onCalendarClose={() => {
            if (!selectedDate) {
              filterOrdersByDate(null);
            }
          }}
          locale="ru"
        />
      </div>

      {Object.keys(groupedOrders).length > 0 ? (
        Object.keys(groupedOrders).map((date) => (
          <div key={date}>
            <h2 className={styles.date}>{date}</h2>
            <ul className={styles["record-list"]}>
              {groupedOrders[date].map((order) => (
                <li className={styles["record-item"]} key={order.record.id}>
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
                      {order.service
                        ? order.service.name
                        : "Неизвестная услуга"}
                    </div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Описание:</strong>
                    <div>
                      {order.service
                        ? order.service.description
                        : "Нет описания"}
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
                  <div className={styles["record-item__inner"]}>
                    <strong>Длительность:</strong>
                    <div>{getDurationText(order.service.duration)}</div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Статус:</strong>
                    {order.record.status === 0 ? (
                      <div className={styles["order-created"]}>
                        Заказ создан
                      </div>
                    ) : (
                      <div className={styles["order-accept"]}>Заказ принят</div>
                    )}
                  </div>
                  {order.record.status === 0 ? (
                    <div className={styles["btn-block"]}>
                      <CustomButton
                        label="Принять заказ"
                        onClick={() => acceptOrder(order)}
                        className={styles.accept}
                        type="submit"
                      />
                      <CustomButton
                        label="Отменить заказ"
                        onClick={() => cancelOrder(order)}
                        className={styles.cancel}
                        type="submit"
                      />
                    </div>
                  ) : (
                    <div className={styles["btn-block"]}>
                      <CustomButton
                        label="Закрыть заказ"
                        onClick={() => closeOrder(order)}
                        className={styles["close"]}
                        type="submit"
                      />
                      <CustomButton
                        label="Отменить заказ"
                        onClick={() => cancelOrder(order)}
                        className={styles.cancel}
                        type="submit"
                      />
                    </div>
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

export default Orders;
