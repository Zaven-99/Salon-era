import React, { useState, useEffect, useRef } from "react";
import styles from "./userMenu.module.scss";
import { useAuth } from "../../../use-auth/use-auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/slices/userSlice";
import { NavLink } from "react-router-dom";

import avatar from "../../../img/icons/avatar.png";
import notification from "../../../img/icons/notifications.png";
import CustomButton from "../../customButton/CustomButton";

const UserMenu = ({ openProfile }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [order, setOrder] = useState([]);
  const [isOpenNotification, setIsOpenNotification] = useState(false);

  const { id, firstName, lastName, imageLink } = useAuth();
  const dispatch = useDispatch();

  // WebSocket для получения заказов клиента
  const wsRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    const socket = new WebSocket("wss://api.salon-era.ru/websocket/records");
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket подключен");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (!Array.isArray(data)) {
          console.warn("Неверный формат данных:", data);
          return;
        }

        // Фильтрация по clientFrom.id === id
        const filtered = data.filter((order) => order.clientFrom?.id === id);
        setOrder(filtered);
      } catch (err) {
        console.error("Ошибка обработки WebSocket-сообщения:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket ошибка:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket закрыт");
    };

    return () => {
      socket.close();
    };
  }, [id]);

  const toggleNotification = async () => {
    if (isOpenNotification) {
      await updateView();
    }
    setIsOpenNotification((prev) => !prev);
  };

  const updateView = async () => {
    try {
      const updatedOrders = [...order];
      for (const orderItem of order) {
        if (!orderItem.record.statusViewed) {
          const formData = new FormData();
          formData.append(
            "clientData",
            JSON.stringify({
              id: orderItem.record.id,
              statusViewed: true,
            })
          );

          const response = await fetch(
            `https://api.salon-era.ru/records/update`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            const index = updatedOrders.findIndex(
              (item) => item.record.id === orderItem.record.id
            );
            if (index !== -1) {
              updatedOrders[index].record.statusViewed = true;
            }
            
          } else {
            const errorText = await response.text();
            throw new Error(
              `Ошибка HTTP! статус: ${response.status}, сообщение: ${errorText}`
            );
          }
        }
      }
      setOrder(updatedOrders);
    } catch (error) {
      console.log(error.message || "Неизвестная ошибка");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      uploadImage(file);
    } else {
      alert("Выберите файл изображения.");
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("clientData", JSON.stringify({ id, firstName }));
      formData.append("imageData", file, file.name);

      const response = await fetch(`https://api.salon-era.ru/clients/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();

      dispatch(setUser({ ...data.clientFrom, token: true }));
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
    }
  };

  const statusViewedCount = order.reduce(
    (count, item) => (item.record.statusViewed ? count : count + 1),
    0
  );

  return (
    <div className={styles["user-menu"]}>
      <div className={styles.avatar}>
        <label htmlFor="image-upload">
          <img
            src={imageLink ? imageLink : avatar}
            alt="Avatar"
            className={styles.avatarImage}
          />
        </label>
        <input
          id="image-upload"
          type="file"
          className={styles.imageInput}
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>

      <div className={styles.user} onClick={openProfile}>
        <p className={styles["user-name"]}>{firstName}</p>
        <p className={styles["user-name"]}>{lastName}</p>
      </div>

      <div className={styles["notifications-block"]}>
        <img
          onClick={toggleNotification}
          className={styles["notifications-img"]}
          src={notification}
          alt=""
        />
        {statusViewedCount > 0 && (
          <div
            className={styles["order-count"]}
            style={{ fontSize: statusViewedCount >= 10 ? "10px" : "inherit" }}
          >
            {statusViewedCount}
          </div>
        )}

        {isOpenNotification && (
          <ul className={styles.notifications}>
            {statusViewedCount > 0 ? (
              order.map((item, index) =>
                !item.record.statusViewed ? (
                  <li className={styles["notifications-item"]} key={index}>
                    <div className={styles["notifications-item__inner"]}>
                      Запись с номером {item.record.number}
                      <div
                        className={
                          styles[
                            item.record.status === 0
                              ? "created"
                              : item.record.status === 100
                              ? "accepted"
                              : item.record.status === 400
                              ? "canceled"
                              : "closed"
                          ]
                        }
                      >
                        {item.record.status === 0
                          ? "создан"
                          : item.record.status === 100
                          ? "принят"
                          : item.record.status === 400
                          ? "отменен"
                          : "закрыт"}
                      </div>
                    </div>
                  </li>
                ) : null
              )
            ) : (
              <li className={styles["notifications-item"]}>
                <p>Уведомлений нет</p>
                <NavLink to="/my-orders">
                  <CustomButton
                    className={styles["all-notifications"]}
                    label="Все уведомления"
                  />
                </NavLink>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
