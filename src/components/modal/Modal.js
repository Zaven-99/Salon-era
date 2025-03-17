import React from "react";
import styles from "./modal.module.scss";
import CustomButton from "../customButton/CustomButton";

const Modal = ({
  toggleOpen,
  toggleClose,
  setEmployeeId,
  setEditServiceId,
  setSlidesId,
  setWorksId,
  setNewsId,
  children,
  isClosing,
}) => {
  if (!toggleOpen) return null;
  const handleClose = () => {
    if (setEmployeeId) {
      setEmployeeId(null);
    }
    if (setEditServiceId) {
      setEditServiceId(null);
    }
    if (setSlidesId) {
      setSlidesId(null);
    }
    if (setWorksId) {
      setWorksId(null);
    }
    if (setNewsId) {
      setNewsId(null);
    }
    toggleClose();
  };
  return (
    <div
      className={`${styles["modal-overlay"]} ${isClosing ? styles.close : ""}`}
      onClick={handleClose}
    >
      <div
        className={`${styles["modal-content"]} ${
          isClosing ? styles.close : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CustomButton
          className={styles["modal-close"]}
          type="button"
          onClick={handleClose}
          label="&#10005;"
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
