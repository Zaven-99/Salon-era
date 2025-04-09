import React, { useState, useEffect } from "react";
import styles from "./historyOrders.module.scss";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";
import Spinner from "../../spinner/Spinner";
import RecordList from './recordList/RecordList';

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
      const response = await fetch("https://api.salon-era.ru/records/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`https error! status: ${response.status}`);
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

  // Функция для подсчета общей суммы
  const calculateTotal = () => {
    const filteredOrders = Object.values(filterOrdersByDate()).flat();
    const totalAllOrders = filteredOrders.reduce(
      (acc, current) => acc + (current.service?.priceLow || 0),
      0
    );

    const totalCancelledOrders = filteredOrders
      .filter((orderItem) => orderItem.record?.status === 400)
      .reduce((acc, current) => acc + (current.service?.priceLow || 0), 0);

    return totalAllOrders - totalCancelledOrders; // Исключаем отмененные заказы
  };

  const total = calculateTotal();

  if (loading) {
    return <Spinner />;
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
            <h2 className={styles.total}>Общая сумма: {total}р.</h2>
          </div>

          {Object.keys(filterOrdersByDate()).length > 0 ? (
            Object.keys(filterOrdersByDate()).map((date) => (
              <div key={date} className={styles["date-group"]}>
                <h2 className={styles.date}>{date}</h2>

                <RecordList
                  filterOrdersByDate={filterOrdersByDate}
                  visibleOrdersCount={visibleOrdersCount}
                  date={date}
                  formatDate={formatDate}
                  setVisibleOrdersCount={setVisibleOrdersCount}
                />
              </div>
            ))
          ) : (
            <p className={styles.message}>Заказов нет</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryOrders;
