import React from "react";

import { NavLink } from "react-router-dom";
import UserMenu from "../userMenu/UserMenu";
import Profile from "../profile/Profile";

import styles from "./navList.module.scss";
import logo from "../../../img/logo.png";

const NavList = ({
  token,
  toggleOpenSignInForm,
  logOut,
  openProfile,
  closeProfile,
  showProfile,
  isClosing,
}) => {
  return (
    <div>
      <ul className={styles.navList}>
        <div className={styles.logo}>
          <NavLink to="/">
            <img src={logo} alt="Логотип" />
          </NavLink>
        </div>
        <div className={styles.wrapper}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? `${styles["navList-item"]} ${styles.active}`
                : styles["navList-item"]
            }
          >
            <p>Главная</p>
          </NavLink>
          <NavLink
            to="/ourWorks"
            className={({ isActive }) =>
              isActive
                ? `${styles["navList-item"]} ${styles.active}`
                : styles["navList-item"]
            }
          >
            <p>Наши работы</p>
          </NavLink>
          <NavLink
            to="/aboutUs"
            className={({ isActive }) =>
              isActive
                ? `${styles["navList-item"]} ${styles.active}`
                : styles["navList-item"]
            }
          >
            <p>О нас</p>
          </NavLink>
        </div>
        {!token ? (
          <p onClick={toggleOpenSignInForm} className={styles["loginBtn"]}>
            Войти в личный кабинет
          </p>
        ) : (
          <UserMenu openProfile={openProfile} />
        )}

        {showProfile && (
          <div>
            <Profile
              closeProfile={closeProfile}
              logOut={logOut}
              isClosing={isClosing}
            />
          </div>
        )}
        <NavLink
          to="https://yandex.ru/maps/org/era/166920481753/?ll=37.823362%2C55.922250&z=13"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className={styles.address}>
            Адрес ул. Болдырева, 3, Королёв этаж 1
          </p>
        </NavLink>
      </ul>
    </div>
  );
};

export default NavList;
