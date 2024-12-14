import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./menuSide.module.scss";

const MenuSide = ({ isMenuOpen, toggleMenu, menuItems, addressLink }) => {
  return (
    <div className={`${styles["menu-side"]} ${isMenuOpen ? styles.open : ""}`}>
      <ul className={styles["menu-side_navList"]}>
        {menuItems.map((item, index) => (
          <NavLink key={index} to={item.path} onClick={toggleMenu}>
            <li
              className={`${styles["menu-side_navList__item"]} ${
                isMenuOpen ? styles.transformation : ""
              }`}
            >
              {item.label}
            </li>
          </NavLink>
        ))}

        {addressLink && (
          <NavLink to={addressLink} target="_blank" rel="noopener noreferrer">
            <li className={styles.addressInMenuSide}>
              Адрес ул. Болдырева, 3, Королёв этаж 1
            </li>
          </NavLink>
        )}
      </ul>
    </div>
  );
};

export default MenuSide;
