import React from "react";
import styles from "./userMenu.module.scss";
import { useAuth } from "../../../use-auth/use-auth";
import { NavLink } from "react-router-dom";
import Spinner from "../../spinner/Spinner";
import avatar from "../../../img/icons/avatar.png";
import notification from "../../../img/icons/notifications.png";
import CustomButton from "../../customButton/CustomButton";
import useImageUpload from "../../hooks/userMenu/UseImageUpload";
import useOrders from "../../hooks/userMenu/UseOrders";
import { useSelector } from "react-redux";

const UserMenu = ({ openProfile }) => {
  const { id, first_name, last_name, image_link } = useAuth();

  const { handleImageChange, loading } = useImageUpload(id);
  const { order, toggleNotification, statusViewedCount, isOpenNotification } =
    useOrders(id);

  const user = useSelector((state) => state.user);
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["user-menu"]}>
      <div className={styles.avatar}>
        <label htmlFor="image-upload">
          <img
            src={image_link ? user.image_link : avatar}
            alt="Avatar"
            className={styles.avatarImage}
          />
        </label>
        <input
          id="image-upload"
          type="file"
          name="image_link"
          className={styles.imageInput}
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>

      <div className={styles.user} onClick={openProfile}>
        <p>
          {first_name?.length > 7
            ? first_name.slice(0, 7)
            : first_name || undefined}
        </p>
        <p className={styles["user-name"]}>
          {last_name?.length > 7
            ? last_name.slice(0, 7)
            : last_name || undefined}
        </p>
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
                !item.record.status_viewed ? (
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
