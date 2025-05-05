import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RecordList from "./recordList/RecordList";
import { HistoryOrdersState } from "../../hooks/historyOrders/historyOrdersState";
import { ru } from "date-fns/locale";
import GenericSkeleton from "../../../utils/Skeleton";

import styles from "./historyOrders.module.scss";

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
            <RecordList
              orders={filteredOrders}
              formatDate={formatDate}
              loading={loading}
            />
          ) : (
            <p className={styles.message}>Заказов нет</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryOrders;
