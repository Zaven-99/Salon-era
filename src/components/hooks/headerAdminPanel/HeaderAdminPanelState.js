import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeUser, setUser } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../use-auth/use-auth";

export const HeaderAdminPanelState = () => {
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login,  } = useAuth();
 

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleOtherModal = () => setShowOtherModal((prev) => !prev);

  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(removeUser());
    dispatch(setUser(null));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    navigate("/");
  };

  return {
    login,
    loading,
    isMenuOpen,
    toggleMenu,
    showOtherModal,
    handleOtherModal,
    handleLogout,
  };
};
