import React from 'react';

import styles from './clientInfo.module.scss'

const ClientInfo = ({client}) => {
	return (
    <div className={styles["client-info__inner"]}>
      <p>
        <strong>Имя:</strong> {client.firstName}
      </p>
      <p>
        <strong>Фамилия:</strong> {client.lastName}
      </p>
      <p>
        <strong>Телефон:</strong> {client.phone}
      </p>
      <p>
        <strong>Email:</strong> {client.email}
      </p>
      <p>
        <strong>Пол:</strong> {client.gender === 0 ? "Женский" : "Мужской"}
      </p>
    </div>
  );
};

export default ClientInfo;