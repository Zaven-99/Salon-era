import React, { useState, useEffect } from "react";
import styles from "./userMenu.module.scss";
import { useAuth } from "../../../use-auth/use-auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/slices/userSlice";
import {NavLink} from 'react-router-dom'

import avatar from "../../../img/icons/avatar.png";
import notification from "../../../img/icons/notifications.png";
import CustomButton from '../../customButton/CustomButton';

const UserMenu = ({ openProfile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [order, setOrder] = useState([]);
  const [isOpenNotification, setIsOpenNotification] = useState(false);

  const { id, firstName, lastName, imageLink } = useAuth();
  const dispatch = useDispatch();

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
            `http://95.163.84.228:6533/records/update`,
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

  const fetchData = async () => {
    try {
      const response = await fetch("http://95.163.84.228:6533/records/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Полученные данные не являются массивом");
      }

      const userOrders = data.filter((order) => order.clientFrom?.id === id);
      setOrder(userOrders);
    } catch (error) {
      console.log("Ошибка при получении данных:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        uploadImage(file);
      } else {
        alert("Выберите файл изображения.");
      }
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        id,
        firstName,
      })
    );

    if (file) {
      formData.append("imageData", file, file.name);
    }
    try {
      const response = await fetch(
        `https://95.163.84.228:6533/clients/update`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Ошибка при сохранении: ${errorMessage}`);
      }

      const data = await response.json();
      setAvatarUrl(data);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          imageLink: data.imageLink,
          token: true,
        })
      );

      dispatch(
        setUser({
          id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          imageLink: data.imageLink,
          token: true,
        })
      );
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
    } finally {
      window.location.reload();
    }
  };

  const statusViewedCount = order.reduce((count, item) => {
    return item.record.statusViewed !== true ? count + 1 : count;
  }, 0);

  return (
    <div className={styles["user-menu"]}>
      <div className={styles.avatar}>
        <label htmlFor="image-upload">
          <img
            src={avatarUrl || imagePreview || imageLink || avatar}
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

      <div className={styles["user"]} onClick={openProfile}>
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
        <div className={styles["order-count"]}>{statusViewedCount}</div>
        {isOpenNotification && (
          <ul className={`${isOpenNotification ? styles.notifications : ''}`}>
            {statusViewedCount > 0 ? (
              order.map((item, index) => (
                <li className={styles["notifications-item"]} key={index}>
                  {!item.record.statusViewed && (
                    <>
                      {item.record.status === 0 && (
                        <p>
                          Заказ с номером {item.record.number}{" "}
                          <span className={styles.created}>создан</span>
                        </p>
                      )}
                      {item.record.status === 100 && (
                        <p>
                          Заказ с номером {item.record.number}{" "}
                          <span className={styles.accepted}>принят</span>
                        </p>
                      )}
                      {item.record.status === 400 && (
                        <p>
                          Заказ с номером {item.record.number}{" "}
                          <span className={styles.canceled}>отменен</span>
                        </p>
                      )}
                      {item.record.status === 500 && (
                        <p>
                          Заказ с номером {item.record.number}{" "}
                          <span className={styles.closed}>закрыт</span>
                        </p>
                      )}
                    </>
                  )}
                </li>
              ))
            ) : (
              <li className={styles["notifications-item"]}>
                <p>Уведомлении нет</p>
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
