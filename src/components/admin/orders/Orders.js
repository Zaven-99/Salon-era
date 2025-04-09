import React, { useState, useEffect, useRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import AppointmentToHaircut from "./appointmentToHaircut/AppointmentToHaircut.js";
import CustomButton from "../../customButton/CustomButton";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { ru } from "date-fns/locale";
import OrderItem from "./orderItem/OrderItem.js";
import Spinner from "../../spinner/Spinner.js";

import styles from "./order.module.scss";

registerLocale("ru", ru);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [addOrderModal, setAddOrderModal] = useState(false);
  const [ws, setWs] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false); // Состояние для уведомления

  useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const notificationSound = new Audio("/sound.mp3");

  // Сохранение ссылок на WebSocket и идентификаторы заказов
  const previousOrdersRef = useRef(null);

  // Подключение WebSocket
  useEffect(() => {
    let socket = null;
    let reconnectTimeout = null;

    const connect = () => {
      socket = new WebSocket("wss://api.salon-era.ru/websocket/records");

      socket.onopen = () => {
        console.log("WebSocket открыт");
        setError(null);
        setLoading(false);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Сравниваем новый список заказов с предыдущим
          if (previousOrdersRef.current) {
            const newOrdersCount = data.length;
            const previousOrdersCount = previousOrdersRef.current.length;

            if (newOrdersCount > previousOrdersCount) {
              // Воспроизводим звук
              notificationSound
                .play()
                .catch((e) => console.warn("Ошибка звука:", e));

              // Показ уведомления
              setNotificationVisible(true);
              setTimeout(() => {
                setNotificationVisible(false);
              }, 3000);
            }
          }

          // Обновляем список заказов
          previousOrdersRef.current = data;
          setOrders(data);
        } catch (e) {
          console.error("Ошибка парсинга WebSocket:", e);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket ошибка:", err);
        setError("Ошибка подключения к WebSocket");
      };

      socket.onclose = (event) => {
        console.warn("WebSocket закрыт", event.code, event.reason);
        setError("WebSocket соединение закрыто");

        // Пытаемся переподключиться
        reconnectTimeout = setTimeout(() => {
          console.log("Переподключение к WebSocket...");
          connect();
        }, 5000);
      };

      setWs(socket);
    };

    connect();

    // Очистка при размонтировании
    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        socket.close(1000, "Компонент размонтирован");
      }
    };
  }, []);

  const formatDate = (date) => {
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };

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

  // Фильтрация заказов по дате
  const filterOrdersByDate = (date, ordersList) => {
    const ordersToFilter = ordersList || orders;

    if (!date) {
      setFilteredOrders(
        ordersToFilter.filter(
          (order) =>
            order.record?.status !== 400 && order.record?.status !== 500
        )
      );
    } else {
      const formattedDate = formatDate(date).split(",")[0];
      setFilteredOrders(
        ordersToFilter.filter(
          (order) =>
            formatDate(order.record?.dateRecord).split(",")[0] ===
              formattedDate &&
            order.record?.status !== 400 &&
            order.record?.status !== 500
        )
      );
    }
  };

  // Применение фильтрации при изменении даты
  useEffect(() => {
    filterOrdersByDate(selectedDate);
  }, [orders, selectedDate]);

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
      <h1 className={styles["orders-today"]}>Заказы</h1>

      {/* Визуальное уведомление при новом заказе */}
      {notificationVisible && (
        <div className={styles.notification}>Новый заказ!</div>
      )}

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
          onClick={toggleOpen}
          className={styles["gr-btn"]}
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
