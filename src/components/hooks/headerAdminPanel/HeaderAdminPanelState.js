import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser, setUser } from "../../../store/slices/userSlice";
import { useAuth } from "../../../use-auth/use-auth";

export const HeaderAdminPanelState = () => {
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const wsRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clientType } = useAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleOtherModal = () => setShowOtherModal((prev) => !prev);

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

  const handleSocketMessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const isInactive = (order) =>
        order.record?.status === 400 || order.record?.status === 500;

      if (Array.isArray(data)) {
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

  const handleSocketError = (error) => {
    console.error("WebSocket ошибка:", error);
  };

  const handleSocketClose = (event) => {
    console.warn("WebSocket закрыт:", event.code, event.reason);
  };

  useEffect(() => {
    wsRef.current = new WebSocket("wss://api.salon-era.ru/websocket/records");

    wsRef.current.onopen = () => {
      console.log("WebSocket открыт");
      setLoading(false);
    };

    wsRef.current.onmessage = handleSocketMessage;
    wsRef.current.onerror = handleSocketError;
    wsRef.current.onclose = handleSocketClose;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    clientType,
    loading,
    isMenuOpen,
    toggleMenu,
    showOtherModal,
    handleOtherModal,
    handleLogout,
    orderCount,
  };
};
