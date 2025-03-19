import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { setUser, removeUser } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../use-auth/use-auth";
import { useDispatch } from "react-redux";
import MenuSideBtn from "../../menuSideBtn/MenuSideBtn";
import MenuSide from "../../menuSide/MenuSide";

import styles from "./headerAdminPanel.module.scss";

const HeaderAdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [orders, setOrders] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clientType } = useAuth();

  const handleOtherModal = () => {
    setShowOtherModal(!showOtherModal);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(removeUser());
    setUser(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    navigate("/");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/records/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`http error! status: ${response.status}`);
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const createdOrders = orders.filter(
    (order) => order.record.status === 0
  ).length;

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
            <li>
              Заказы
              <span className={styles["create-orders"]}>{createdOrders}</span>
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
