import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "../../../store/slices/userSlice";
import { useAuth } from "../../../use-auth/use-auth";
import { useNavigate } from "react-router-dom";

export const HeaderState = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const { token } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const openProfile = () => {
    setShowProfile(true);
  };

  const closeProfile = () => {
    document.body.style.overflow = "scroll";
    setTimeout(() => {
      setShowProfile(false);
    }, 100);
  };

  
  const logOut = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Отправка запроса на выход
      await fetch("https://api.salon-era.ru/clients/onExit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }

    // Очистка и редирект
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(removeUser());
    setUser(null);
    navigate("/");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    closeProfile();
    setLoading(false);
  };

  return {
    showProfile,
    setShowProfile,
    showMessage,
    setShowMessage,
    isMenuOpen,
    setIsMenuOpen,
    loading,
    setLoading,
    user,
    setUser,
    token,
    toggleMenu,
    toggleShowMessage,
    openProfile,
    closeProfile,
    logOut,
  };
};
