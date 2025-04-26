import React from "react";
import styles from "./historyOrders.module.scss";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";
import Spinner from "../../spinner/Spinner";
import RecordList from "./recordList/RecordList";
import { HistoryOrdersState } from "../../hooks/historyOrders/historyOrdersState";

registerLocale("ru", ru);

const HistoryOrders = () => {
  const {
    filteredOrders,
    selectedDate,
    setSelectedDate,
    loading,
    error,
    total,
    formatDate,
  } = HistoryOrdersState();

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

          {filteredOrders.length > 0 ? (
            <RecordList orders={filteredOrders} formatDate={formatDate} />
          ) : (
            <p className={styles.message}>Заказов нет</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryOrders;
