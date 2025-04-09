import React, { useState } from "react";

import styles from "./recordList.module.scss";
import CustomButton from "../../../customButton/CustomButton";

const RecordList = ({ filterOrdersByDate, date, formatDate }) => {
  // Состояние для текущей страницы
  const [currentPage, setCurrentPage] = useState(1);
  // Количество заказов на странице
  const ordersPerPage = 5;

  // Получаем все заказы для данной даты
  const orders = filterOrdersByDate()[date];

  // Определяем индексы заказов для текущей страницы
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Функция для перехода на следующую страницу
  const handleNextPage = () => {
    if (indexOfLastOrder < orders.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Функция для перехода на предыдущую страницу
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Функция для перехода на первую страницу
  const handleGoToFirstPage = () => {
    setCurrentPage(1);
  };

  // Получаем количество страниц
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Функция для изменения страницы
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Генерация списка страниц
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
                {order.clientTo
                  ? `${order.clientTo.firstName} ${order.clientTo.lastName}`
                  : "Неизвестный парикмахер"}
              </div>
            </div>
            <div className={styles["record-item__inner"]}>
              <strong>Услуга:</strong>
              <div>
                {order.service ? order.service.name : "Неизвестная услуга"}
              </div>
            </div>
            <div className={styles["record-item__inner"]}>
              <strong>Описание:</strong>
              <div>
                {order.service ? order.service.description : "Нет описания"}
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
              {order.record.status === 500 ? (
                <div className={styles[`order-closed`]}>Заказ закрыт</div>
              ) : order.record.status === 400 ? (
                <div className={styles[`order-canceled`]}>Заказ отменен</div>
              ) : order.record.status === 0 ? (
                <div className={styles[`order-created`]}>Заказ создан</div>
              ) : order.record.status === 100 ? (
                <div className={styles[`order-accept`]}>Заказ принят</div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {/* Пагинация с номерами страниц */}
      <div className={styles.pagination}>
        {/* Кнопка "В начало" */}
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

        {/* Отображение номеров страниц */}
        {pageNumbers.map((number) => (
          <CustomButton
            key={number}
            label={number}
            className={`${styles["pagination-btn"]} ${
              currentPage === number ? styles["active"] : ""
            }`}
            onClick={() => handlePageChange(number)}
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
