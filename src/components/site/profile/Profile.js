import React from "react";
import { useAuth } from "../../../use-auth/use-auth";
import { NavLink } from "react-router-dom";

import styles from "./profile.module.scss";
import CustomButton from "../../customButton/CustomButton";

const Profile = ({ closeProfile, logOut, isClosing }) => {
  const { phone, email, login } = useAuth();
  if (!closeProfile) return null;

  return (
    <div
      className={`${styles["profile-overlay"]} ${
        isClosing ? styles.close : ""
      }`}
      onClick={closeProfile}
    >
      <div
        className={`${styles["profile-content"]} ${
          isClosing ? styles.close : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles["contact-item"]}>Логин:{login}</p>
        <p className={styles["contact-item"]}>Номер телефона:{phone}</p>
        <p className={styles["contact-item"]}>Почта:{email}</p>
        <CustomButton
          className={styles["profile-close"]}
          type="button"
          label="&#10005;"
          onClick={closeProfile}
        />

        <NavLink to="/my-orders">
          <li className={styles["my-records"]}>Мои записи</li>
        </NavLink>

        <p className={styles.logOut} onClick={logOut}>
          выйти
        </p>
      </div>
    </div>
  );
};

export default Profile;
