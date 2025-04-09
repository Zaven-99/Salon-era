import React, { useState, useEffect, useRef } from "react";
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
  const [orderCount, setOrderCount] = useState(0);
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

  const wsRef = useRef(null); // Храним ссылку на WebSocket соединение

  const handleSocketMessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      const isInactive = (order) =>
        order.record?.status === 400 || order.record?.status === 500;

      if (Array.isArray(data)) {
        // фильтруем только активные заказы
        const activeOrders = data.filter((order) => !isInactive(order));
        setOrders(activeOrders);
        setOrderCount(activeOrders.length);
      } else {
        setOrders((prevOrders) => {
          const updatedOrders = isInactive(data)
            ? prevOrders.filter((o) => o.record.id !== data.record.id)
            : [
                data,
                ...prevOrders.filter((o) => o.record.id !== data.record.id),
              ];

          setOrderCount(updatedOrders.length);
          return updatedOrders;
        });
      }
    } catch (error) {
      console.error("Ошибка обработки данных WebSocket", error);
    }
  };


  // Функция для обработки ошибок WebSocket
  const handleSocketError = (error) => {
    // setError("Ошибка подключения к WebSocket");
    console.error("WebSocket ошибка:", error);
  };

  // Функция для обработки закрытия соединения WebSocket
  const handleSocketClose = (event) => {
    // setError("WebSocket соединение закрыто");
    console.warn("WebSocket закрыт:", event.code, event.reason);
  };

  useEffect(() => {
    // Устанавливаем соединение с WebSocket сервером
    wsRef.current = new WebSocket("wss://api.salon-era.ru/websocket/records");

    wsRef.current.onopen = () => {
      console.log("WebSocket открыт");
      setLoading(false);
    };

    wsRef.current.onmessage = handleSocketMessage;
    wsRef.current.onerror = handleSocketError;
    wsRef.current.onclose = handleSocketClose;

    // Очистка при размонтировании компонента
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []); 

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
