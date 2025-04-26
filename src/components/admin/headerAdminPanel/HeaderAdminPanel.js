import React from "react";
import { NavLink } from "react-router-dom";

import MenuSideBtn from "../../menuSideBtn/MenuSideBtn";
import MenuSide from "../../menuSide/MenuSide";
import { HeaderAdminPanelState } from "../../hooks/headerAdminPanel/HeaderAdminPanelState";

import styles from "./headerAdminPanel.module.scss";

const HeaderAdminPanel = () => {
  const {
    clientType,
    isMenuOpen,
    toggleMenu,
    showOtherModal,
    handleOtherModal,
    handleLogout,
    orderCount,
  } = HeaderAdminPanelState();

  const menuItems = [
    { path: "/adminPanel/orders", label: "Заказы" },
    { path: "/adminPanel/history-orders", label: "История заказов" },
    { path: "/adminPanel/employee", label: "Сотрудники" },
    { path: "/adminPanel/services", label: "Услуги" },
    { path: "/adminPanel/our-works", label: "Работы" },
    { path: "/adminPanel/news", label: "Новости" },
    { path: "/adminPanel/slides", label: "Слайдер" },
    { path: "/adminPanel/schedule", label: "График" },
  ];

  return (
    <div className={styles["header-admin__panel"]}>
      <div className={styles["header-top"]}>
        <p className={styles.status}>Вы вошли как {clientType}</p>
        <p onClick={handleLogout} className={styles.logOut}>
          Выйти
        </p>
      </div>
      <div className={styles.wrapper}>
        <MenuSideBtn
          className={styles["menu-btn"]}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
        />
        <MenuSide
          menuItems={menuItems}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
        />
        <ul className={styles.navigation}>
          <NavLink to="/adminPanel/orders">
            <li className={styles["orders"]}>
              Заказы
              <span className={styles["create-orders"]}>{orderCount}</span>
            </li>
          </NavLink>
          <NavLink to="/adminPanel/history-orders">
            <li>История заказов</li>
          </NavLink>
          <NavLink to="/adminPanel/schedule">
            <li>График</li>
          </NavLink>

          <div onClick={handleOtherModal} className={styles["other-btn"]}>
            Прочее
            {showOtherModal && (
              <div className={styles["other-modal"]}>
                <ul>
                  <NavLink to="/adminPanel/employee">
                    <li>Сотрудники</li>
                  </NavLink>
                  <NavLink to="/adminPanel/services">
                    <li>Услуги</li>
                  </NavLink>
                  <NavLink to="/adminPanel/our-works">
                    <li>Работы</li>
                  </NavLink>
                  <NavLink to="/adminPanel/news">
                    <li>Новости</li>
                  </NavLink>
                  <NavLink to="/adminPanel/slides">
                    <li>Слайдер</li>
                  </NavLink>
                </ul>
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default HeaderAdminPanel;
