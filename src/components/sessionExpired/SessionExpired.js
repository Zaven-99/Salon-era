import React from 'react';
import CustomButton from '../customButton/CustomButton';
import styles from './sessionExpired.module.scss'
import spinner from "../../img/icons/Loading_icon.gif";

const SessionExpired = ({ handleSessionExpiredConfirm }) => {
  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <img className={styles.spinner} src={spinner} alt="" />
        <p>Сессия истекла. Пожалуйста, войдите снова.</p>
        <CustomButton
          label="Ок"
          onClick={handleSessionExpiredConfirm}
          className={styles['b-btn']}
        />
      </div>
    </div>
  );
};

export default SessionExpired;