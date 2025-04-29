import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import AppointmentToHaircut from "./appointmentToHaircut/AppointmentToHaircut.js";
import CustomButton from "../../customButton/CustomButton";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";
import OrderItem from "./orderItem/OrderItem.js";
import Spinner from "../../spinner/Spinner.js";
import { useOrdersState } from "../../hooks/orders/OrdersState.js";
import { ToastContainer } from "react-toastify"; // Импортируем ToastContainer

import styles from "./order.module.scss";

registerLocale("ru", ru);

const Orders = () => {
  const {
    filteredOrders,
    setOrders,
    error,
    loading,
    selectedDate,
    setSelectedDate,
    addOrderModal,
    setAddOrderModal,
    toggleOpen,
    filterOrdersByDate,
    formatDate,
    setError,
  } = useOrdersState();

  if (error) return <div className={styles.error}>Ошибка: {error}</div>;
  if (loading) return <Spinner />;
  return (
    <div>
      <ToastContainer
        position="top-right" // Позиция уведомлений (можно изменить)
        autoClose={5000} // Время, через которое уведомление автоматически исчезнет
        hideProgressBar={true} // Показывать ли прогресс-бар
        newestOnTop={false} // Уведомления сверху или снизу
        closeOnClick // Закрытие по клику
        rtl={false} // Для RTL языков, можно сделать true, если нужен арабский/иудейский стиль
      />
      {error && <p>Ошибка: {error}</p>}
      <h1 className={styles["orders-today"]}>Заказы</h1>

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
