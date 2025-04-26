import React from "react";
import { useAuth } from "../../../use-auth/use-auth";
import CustomButton from "../../customButton/CustomButton";
import Spinner from "../../spinner/Spinner";
import { MyRecordsState } from "../../hooks/myRecords/MyRecordsState";
import styles from "./myRecords.module.scss";

const MyRecords = () => {
  const { id: clientId } = useAuth();
  const { loading, order, error, cancelOrder, formatDate, total } =
    MyRecordsState(clientId);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["myRecords"]}>
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
      <h1>Мои заказы</h1>

      <h2 className={styles.total}>Общая сумма: {total} руб.</h2>

      {order.length > 0 ? (
        <ul className={styles["records-list"]}>
          {order.map((order, index) => {
            if (!order?.record) {
              return (
                <li key={index} className={styles["records-list__item"]}>
                  <p>Ошибка: отсутствует информация о заказе</p>
                </li>
              );
            }

            return (
              <li key={index} className={styles["records-list__item"]}>
                <div>
                  <strong>Номер заказа:</strong>{" "}
                  <span>{order.record.number}</span>
                </div>
                <div>
                  <strong>Парикмахер: </strong>
                  <span>{order.clientTo?.firstName}&nbsp;</span>
                  <span>{order.clientTo?.lastName}</span>
                </div>
                {order.record?.status === 0 ? (
                  <div className={styles.status}>
                    <strong>Статус: </strong>
                    <span className={styles.created}>Заказ создан</span>
                  </div>
                ) : order.record?.status === 400 ? (
                  <div className={styles.status}>
                    <strong>Статус: </strong>{" "}
                    <span className={styles.canceled}>Заказ отменен</span>
                  </div>
                ) : order.record?.status === 100 ? (
                  <div className={styles.status}>
                    <strong>Статус: </strong>{" "}
                    <span className={styles.accept}>Заказ принят</span>
                  </div>
                ) : (
                  <div className={styles.status}>
                    <strong>Статус: </strong>{" "}
                    <span className={styles.closed}>Заказ закрыт</span>
                  </div>
                )}
                <div>
                  <strong>Дата заказа: </strong>
                  <span>{formatDate(order.record.dateRecord)}</span>
                </div>

                <div>
                  <strong>Стоимость: </strong>
                  <span>{order.service?.priceLow} руб.</span>
                </div>
                {order.record?.status === 0 ? (
                  <CustomButton
                    label="Отменить"
                    onClick={() => cancelOrder(order)}
                    className={styles.cancel}
                    type="submit"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.empty}>Заказы отсутствуют.</p>
      )}
    </div>
  );
};

export default MyRecords;
