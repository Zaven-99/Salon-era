import React from 'react';

import styles from './menuSideBtn.module.scss'

const MenuBtn = ({ isMenuOpen, toggleMenu }) => {
  return (
    <div
      className={`${styles["menu-toggle"]} ${
        isMenuOpen ? styles.transformation : ""
      }`}
      onClick={toggleMenu}
    >
      <div
        className={`${styles.item1} ${isMenuOpen ? styles.transformation : ""}`}
      ></div>
      <div
        className={`${styles.item2} ${isMenuOpen ? styles.transformation : ""}`}
      ></div>
      <div
        className={`${styles.item3} ${isMenuOpen ? styles.transformation : ""}`}
      ></div>
    </div>
  );
};

export default MenuBtn;