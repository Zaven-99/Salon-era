import React from 'react';

import styles from './helpModal.module.scss'

const HelpModal = () => {
	return (
    <div className={styles.help}>
      <h2>
        Пароль должен содержать не менее 8 символов.
      </h2>
      <ul className={styles['help-description']}>
        <h2>Также в нём должны быть:</h2>
        <li className={styles["help-item"]}>
          как минимум одна заглавная и одна строчная буква;
        </li>
        <li className={styles["help-item"]}>как минимум 1 цифра.</li>
        <li className={styles["help-item"]}>
          Допускается наличие следующих символов: ~ ! ? @ # $ % ^ & * _ - + ( )
          [ ] {} &gt; &lt; / | " ' .
        </li>
      </ul>
    </div>
  );
};

export default HelpModal;