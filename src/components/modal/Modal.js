import React from "react";
import styles from "./modal.module.scss";
import CustomButton from "../customButton/CustomButton";

const Modal = ({
  toggleOpenSignInForm,
  toggleCloseSignInForm,
  setEmployeeId,
  setEditServiceId,
  setSlidesId,
  setWorksId,
  setNewsId,
  children,
  isClosing,
}) => {
  if (!toggleOpenSignInForm) return null;
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
    toggleCloseSignInForm();
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
