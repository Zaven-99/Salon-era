import React from "react";

import { HeaderState } from "../../hooks/header/HeaderState";
import Slides from "../../../carousel/Slides";
import MenuSideBtn from "../../menuSideBtn/MenuSideBtn";
import MenuSide from "../../menuSide/MenuSide";
import Modal from "../../modal/Modal";
import NavList from "../navList/NavList";
import Spinner from "../../spinner/Spinner";
import SignIn from "../signInForm/SignInForm";

import styles from "./header.module.scss";

const Header = ({ openSignInForm, isClosing, toggleOpen, toggleClose }) => {
  const {
    showProfile,
    showMessage,
    isMenuOpen,
    loading,
    token,
    toggleMenu,
    toggleShowMessage,
    openProfile,
    closeProfile,
    logOut,
  } = HeaderState();

  const menuItems = [
    { path: "/", label: "Главная" },
    { path: "/ourWorks", label: "Наши работы" },
    { path: "/aboutUs", label: "О нас" },
  ];

  const addressLink =
    "https://yandex.ru/maps/org/era/166920481753/?ll=37.823362%2C55.922250&z=13";

  if (loading) {
    return <Spinner />;
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
            toggleOpen={toggleOpen}
            logOut={logOut}
            openProfile={openProfile}
            closeProfile={closeProfile}
            showProfile={showProfile}
            isClosing={isClosing}
          />
        </nav>

        {openSignInForm && (
          <Modal
            toggleOpen={toggleOpen}
            toggleClose={toggleClose}
            isClosing={isClosing}
          >
            <SignIn
              toggleClose={toggleClose}
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
