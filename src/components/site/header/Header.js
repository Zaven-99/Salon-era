import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "../../../store/slices/userSlice";
import { useAuth } from "../../../use-auth/use-auth";

import Slides from "../../../carousel/Slides";
import MenuSideBtn from "../../menuSideBtn/MenuSideBtn";
import MenuSide from "../../menuSide/MenuSide";
import Modal from "../../modal/Modal";
import NavList from "../navList/NavList";
import Spinner from '../../spinner/Spinner';
import SignIn from "../signInForm/SignInForm";

import styles from "./header.module.scss";

const Header = () => {
  const [openSignInForm, setOpenSignInForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const [user, setUser] = useState(null);
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

  const toggleOpenSignInForm = () => {
    setOpenSignInForm(true);
    document.body.style.overflow = "hidden";
    setIsClosing(false);
  };
  const toggleCloseSignInForm = () => {
    document.body.style.overflow = "scroll";
    setTimeout(() => {
      setOpenSignInForm(false);
    }, 100);
    setIsClosing(true);
  };

  const toggleShowMessage = () => {
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const openProfile = () => {
    setShowProfile(true);
    setIsClosing(false);
  };

  const closeProfile = () => {
    document.body.style.overflow = "scroll";
    setTimeout(() => {
      setShowProfile(false);
    }, 100);
    setIsClosing(true);
  };

  const logOut = async () => {
    setLoading(true);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(removeUser());
    setUser(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    closeProfile();
    setLoading(false);
  };

   const menuItems = [
     { path: "/", label: "Главная" },
     { path: "/ourWorks", label: "Наши работы" },
     { path: "/aboutUs", label: "О нас" },
   ];

     const addressLink =
       "https://yandex.ru/maps/org/era/166920481753/?ll=37.823362%2C55.922250&z=13";


if (loading) {
  return <Spinner/>;
}

  return (
    <header className={styles.header}>
      <div className={styles["header-inner"]}>
        <nav className={styles.navigation}>
          <MenuSideBtn isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

          <MenuSide
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            menuItems={menuItems}
            addressLink={addressLink}
          />
          <NavList
            token={token}
            toggleOpenSignInForm={toggleOpenSignInForm}
            logOut={logOut}
            openProfile={openProfile}
            closeProfile={closeProfile}
            showProfile={showProfile}
            isClosing={isClosing}
          />
        </nav>

        {openSignInForm && (
          <Modal
            toggleOpenSignInForm={toggleOpenSignInForm}
            toggleCloseSignInForm={toggleCloseSignInForm}
            isClosing={isClosing}
          >
            <SignIn
              toggleCloseSignInForm={toggleCloseSignInForm}
              toggleShowMessage={toggleShowMessage}
              logOut={logOut}
            />
          </Modal>
        )}

        {showMessage && (
          <div className={styles["modal-overlay"]}>
            <div className={styles["success-form"]}>
              <p>Вы успешно зарегистрировались</p>
            </div>
          </div>
        )}
      </div>
      <Slides />
    </header>
  );
};

export default Header;
