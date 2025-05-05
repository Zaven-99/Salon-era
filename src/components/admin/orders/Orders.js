import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import AppointmentToHaircut from "./appointmentToHaircut/AppointmentToHaircut.js";
import CustomButton from "../../customButton/CustomButton";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";
import OrderItem from "./orderItem/OrderItem.js";
import { useOrdersState } from "../../hooks/orders/OrdersState.js";
import { ToastContainer } from "react-toastify";
import GenericSkeleton from "../../../utils/Skeleton";

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

  if (loading) {
    return (
      <GenericSkeleton
        headerCount={1}
        headerWidths={["50%", "30%"]}
        itemCount={10}
        itemWidth="100%"
        itemHeight={50}
      />
    );
  }

  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
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
          className={styles["b-btn"]}
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
