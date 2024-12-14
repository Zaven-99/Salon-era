import React, { useState, useEffect } from "react";
import styles from "./historyOrders.module.scss";
 import CustomButton from "../../customButton/CustomButton";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";
import Spinner from "../../spinner/Spinner";

registerLocale("ru", ru);

const HistoryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleOrdersCount, setVisibleOrdersCount] = useState({});
  const [groupedOrders, setGroupedOrders] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

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
      data.sort(
        (a, b) => new Date(b.record.dateRecord) - new Date(a.record.dateRecord)
      );
      setOrders(data);

      const groupedOrdersData = data.reduce((acc, order) => {
        const dateKey = formatDate(order.record.dateRecord).split(",")[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(order);
        return acc;
      }, {});

      setGroupedOrders(groupedOrdersData);

      const initialVisibleCount = {};
      Object.keys(groupedOrdersData).forEach((date) => {
        initialVisibleCount[date] = 5;
      });
      setVisibleOrdersCount(initialVisibleCount);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
    };
    return new Date(date).toLocaleString("ru-RU", options);
  };

  const handleLoadMore = (date) => {
    setVisibleOrdersCount((prevCount) => ({
      ...prevCount,
      [date]: prevCount[date] + 5,
    }));
  };

  const fetchDelete = async (id) => {
    setLoading(true);
    setError(null);

    const orderExists = orders.some((order) => order.record.id === id);
    if (!orderExists) {
      setError(`Заказ с ID ${id} не найден.`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://95.163.84.228:6533/records?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 204) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.record.id !== id)
        );
        setGroupedOrders((prevGroupedOrders) => {
          const updatedGroupedOrders = { ...prevGroupedOrders };
          Object.keys(updatedGroupedOrders).forEach((date) => {
            updatedGroupedOrders[date] = updatedGroupedOrders[date].filter(
              (order) => order.record.id !== id
            );
          });
          return updatedGroupedOrders;
        });
      } else if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.record.id !== id)
        );
        setGroupedOrders((prevGroupedOrders) => {
          const updatedGroupedOrders = { ...prevGroupedOrders };
          Object.keys(updatedGroupedOrders).forEach((date) => {
            updatedGroupedOrders[date] = updatedGroupedOrders[date].filter(
              (order) => order.record.id !== id
            );
          });
          return updatedGroupedOrders;
        });
      } else {
        throw new Error(`Ошибка при удалении: HTTP status ${response.status}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByDate = () => {
    if (!selectedDate) {
      return groupedOrders;
    }

    const formattedDate = formatDate(selectedDate).split(",")[0];
    const filteredGroupedOrders = {};
    Object.keys(groupedOrders).forEach((date) => {
      if (date === formattedDate) {
        filteredGroupedOrders[date] = groupedOrders[date];
      }
    });

    return filteredGroupedOrders;
  };

  if(loading){
    <Spinner/>
  }

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <h1 className={styles["history-orders"]}>История Заказов</h1>

          <div className={styles.datePickerWrapper}>
            <DatePicker
              className={styles.dataPicker}
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd MMM yyyy"
              placeholderText="Выберите дату"
              isClearable
              locale="ru"
            />
          </div>
          {Object.keys(filterOrdersByDate()).length > 0 ? (
            Object.keys(filterOrdersByDate()).map((date) => (
              <div key={date} className={styles["date-group"]}>
                <h2 className={styles.date}>{date}</h2>
                <ul className={styles["record-list"]}>
                  {filterOrdersByDate()
                    [date].slice(0, visibleOrdersCount[date] || 0)
                    .map((order) => (
                      <li
                        key={order.record.id}
                        className={styles["record-item"]}
                      >
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
                        <div className={styles.wrapper}>
                          <strong>Статус:</strong>
                          {order.record.status === "Заказ закрыт" ? (
                            <div className={styles[`order-closed`]}>
                              {order.record.status}
                            </div>
                          ) : order.record.status === "Заказ отменен" ? (
                            <div className={styles[`order-canceled`]}>
                              {order.record.status}
                            </div>
                          ) : order.record.status === "Заказ создан" ? (
                            <div className={styles[`order-created`]}>
                              {order.record.status}
                            </div>
                          ) : order.record.status === "Заказ принят" ? (
                            <div className={styles[`order-accept`]}>
                              {order.record.status}
                            </div>
                          ) : null}
                          <CustomButton
                            label="Удалить"
                            onClick={() => fetchDelete(order.record.id)}
                            className={styles.delete}
                          />
                        </div>
                      </li>
                    ))}
                </ul>
                {filterOrdersByDate()[date].length >
                  (visibleOrdersCount[date] || 0) && (
                  <CustomButton
                    label="Загрузить еще"
                    className={styles["load-more"]}
                    onClick={() => handleLoadMore(date)}
                  />
                )}
              </div>
            ))
          ) : (
            <p className={styles.message}>История пуста </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryOrders;
