import React, { useState, useEffect } from "react";
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

  const toggleNotification = async () => {
    if (
      isOpenNotification &&
      order.some((orderItem) => !orderItem.record.statusViewed)
    ) {
      await updateView();
    }
    setIsOpenNotification((prev) => !prev);
  };

  const updateView = async () => {
    try {
      const updatedOrders = order.map((orderItem) => {
        if (!orderItem.record.statusViewed) {
          fetch(`https://api.salon-era.ru/records/update`, {
            method: "POST",
            body: JSON.stringify({
              id: orderItem.record.id,
              statusViewed: true,
            }),
            headers: { "Content-Type": "application/json" },
          });
          return {
            ...orderItem,
            record: { ...orderItem.record, statusViewed: true },
          };
        }
        return orderItem;
      });

      setOrder(updatedOrders);
    } catch (error) {
      console.log(error.message || "Неизвестная ошибка");
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/records/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok)
        throw new Error(`http error! status: ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data))
        throw new Error("Полученные данные не являются массивом");

      setOrder(data.filter((order) => order.clientFrom?.id === id));
    } catch (error) {
      console.log("Ошибка при получении данных:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

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
    } finally {
      window.location.reload();
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
            src={imageLink || avatar}
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
          <div className={styles["order-count"]}>{statusViewedCount}</div>
        )}

        {isOpenNotification && (
          <ul className={styles.notifications}>
            {statusViewedCount > 0 ? (
              order.map((item, index) =>
                !item.record.statusViewed ? (
                  <li className={styles["notifications-item"]} key={index}>
                    <div className={styles["notifications-item__inner"]}>
                      Заказ с номером {item.record.number}{" "}
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
