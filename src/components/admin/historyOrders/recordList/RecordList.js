import React, { useState } from "react";
import CustomButton from "../../../customButton/CustomButton";

import styles from "./recordList.module.scss";

const RecordList = ({ orders, formatDate, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.record.dateRecord) - new Date(a.record.dateRecord)
  );

  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleGoToFirstPage = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <ul className={styles["record-list"]}>
        {currentOrders.map((order) => (
          <li key={order.record.id} className={styles["record-item"]}>
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
                {order.employeeTo
                  ? `${order.employeeTo.firstName} ${order.employeeTo.lastName}`
                  : "Неизвестный парикмахер"}
              </div>
            </div>

            <div className={styles["record-item__inner"]}>
              <strong>Услуга:</strong>
              <div>{order.service?.name || "Неизвестная услуга"}</div>
            </div>

            <div className={styles["record-item__inner"]}>
              <strong>Описание:</strong>
              <div>{order.service?.description || "Нет описания"}</div>
            </div>

            <div className={styles["record-item__inner"]}>
              <strong>Цена:</strong>
              <div>
                {order.record?.price
                  ? `${order.record.price}р.`
                  : order.service?.priceLow
                  ? `${order.service.priceLow}р.`
                  : "цена недоступна"}
              </div>
            </div>

            <div className={styles["record-item__inner"]}>
              <strong>Дата:</strong>
              <div>{formatDate(order.record.dateRecord)}</div>
            </div>

            <div className={styles.wrapper}>
              <strong>Статус:</strong>
              {order.record.status === 500 ? (
                <div className={styles["order-closed"]}>Заказ закрыт</div>
              ) : order.record.status === 400 ? (
                <div className={styles["order-canceled"]}>Заказ отменен</div>
              ) : order.record.status === 0 ? (
                <div className={styles["order-created"]}>Заказ создан</div>
              ) : order.record.status === 100 ? (
                <div className={styles["order-accept"]}>Заказ принят</div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {/* Пагинация */}
      <div className={styles.pagination}>
        <CustomButton
          label="В начало"
          className={styles["pagination-btn"]}
          onClick={handleGoToFirstPage}
          disabled={currentPage === 1}
        />
        <CustomButton
          label="Предыдущая"
          className={styles["pagination-btn"]}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        />
        {pageNumbers.map((number) => (
          <CustomButton
            key={number}
            label={number}
            onClick={() => handlePageChange(number)}
            className={`${styles["pagination-btn"]} ${
              currentPage === number ? styles["active"] : ""
            }`}
          />
        ))}
        <CustomButton
          label="Следующая"
          className={styles["pagination-btn"]}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        />
      </div>
    </div>
  );
};

export default RecordList;
