import React from "react";
import { useAuth } from "../../../../../../use-auth/use-auth";

import styles from "./clientInfo.module.scss";

const ClientInfo = ({ client }) => {
  const { firstName, lastName, phone, email } = useAuth();
  return (
    <div className={styles["client-info__inner"]}>
      <p>
        <strong>Имя:</strong> {firstName || client.firstName}
      </p>
      <p>
        <strong>Фамилия:</strong> {lastName || client.lastName}
      </p>
      <p>
        <strong>Телефон:</strong> {phone || client.phone}
      </p>
      <p>
        <strong>Email:</strong> {email || client.email}
      </p>
      <p>
        <strong>Пол:</strong> {client.gender === 0 ? "Женский" : "Мужской"}
      </p>
    </div>
  );
};

export default ClientInfo;
