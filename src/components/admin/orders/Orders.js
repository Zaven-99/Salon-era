import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import AppointmentToHaircut from "./appointmentToHaircut/AppointmentToHaircut.js";
import CustomButton from "../../customButton/CustomButton";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { ru } from "date-fns/locale";
import OrderItem from "./orderItem/OrderItem.js";
import Spinner from "../../spinner/Spinner.js";

import reload from "../../../img/icons/reload.png";
import styles from "./order.module.scss";

registerLocale("ru", ru);

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [addOrderModal, setAddOrderModal] = useState(false);
  const [onReload, setOnReload] = useState(false);

  useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

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
        throw new Error(`Ошибка http! статус: ${response.status}`);
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
    if (addOrderModal || onReload) {
      return;
    }

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, [addOrderModal, onReload]);

  const toggleOnAutoReload = () => {
    setOnReload(!onReload);
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

  const toggleOpen = () => {
    setAddOrderModal(true);
    document.body.style.overflow = "hidden";
  };

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      {error && <p>Ошибка: {error}</p>}
      <h1 className={styles["orders-today"]}>Заказы на сегодня</h1>

      <div className={styles.wrapper}>
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
        <CustomButton
          label={
            onReload ? (
              <div className={styles["stop-reload"]}>
                <img src={reload} alt="" />
              </div>
            ) : (
              <div className={styles["reload"]}>
                <img src={reload} alt="" />
              </div>
            )
          }
          onClick={toggleOnAutoReload}
          className={onReload ? styles.on : styles.off}
        />

        <CustomButton
          onClick={toggleOpen}
          className={styles["add-order"]}
          label="Записать"
        />
      </div>

      {addOrderModal && (
        <AppointmentToHaircut
          setAddOrderModal={setAddOrderModal}
          toggleOpen={toggleOpen}
          addOrderModal={addOrderModal}
          selectedDate={selectedDate}
        />
      )}

      <OrderItem
        filteredOrders={filteredOrders}
        setOrders={setOrders}
        setError={setError}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Orders;
