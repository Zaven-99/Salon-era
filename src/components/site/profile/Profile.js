import React from "react";
import { useAuth } from "../../../use-auth/use-auth";
import { NavLink } from "react-router-dom";
import { ProfileState } from "../../hooks/profile/ProfileState";
import styles from "./profile.module.scss";
import CustomButton from "../../customButton/CustomButton";
import Spinner from "../../spinner/Spinner";
import recycle from "../../../img/icons/recycle.png";

const Profile = ({ closeProfile, logOut, isClosing }) => {
  const {
    loading,
    clients,
    confirmDeleteEmployee,
    clientToDelete,
    showMessageDeleteClients,
    closeMessageDeleteClients,
    handleDelete,
  } = ProfileState(logOut);

  const { phone, email, login, id } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div
      className={`${styles["profile-overlay"]} ${
        isClosing ? styles.close : ""
      }`}
      onClick={closeProfile}
    >
      <div
        className={`${styles["profile-content"]} ${
          isClosing ? styles.close : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles["contact-item"]}>
          <strong>Логин:&nbsp;</strong>
          {login}
        </p>
        <p className={styles["contact-item"]}>
          <strong>Номер телефона:&nbsp;</strong>
          {phone}
        </p>
        <p className={styles["contact-item"]}>
          <strong>Почта:&nbsp;</strong>
          {email}
        </p>
        <CustomButton
          className={styles["profile-close"]}
          type="button"
          label="&#10005;"
          onClick={closeProfile}
        />

        <NavLink to="/my-orders">
          <li className={styles["my-records"]}>Мои записи</li>
        </NavLink>

        {confirmDeleteEmployee && clientToDelete && (
          <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
              <h2 className={styles["choose"]}>
                Вы действительно хотите удалить аккаунт?
              </h2>

              <div className={styles["btn-block"]}>
                <CustomButton
                  className={styles["delete-clients"]}
                  type="button"
                  label="Удалить аккаунт"
                  onClick={() => handleDelete(clientToDelete)}
                />
                <CustomButton
                  className={styles["cancel-delete__clients"]}
                  type="button"
                  label="Отменить удаление"
                  onClick={closeMessageDeleteClients}
                />
              </div>
            </div>
          </div>
        )}

        <p className={styles.logOut} onClick={logOut}>
          Выйти
        </p>
        {clients.map((client) => (
          <div key={client.id}>
            {id === client.id && (
              <div className={styles["delete-account"]}>
                <div
                  className={styles["delete-account__inner"]}
                  onClick={() => showMessageDeleteClients(client.id)}
                >
                  <img className={styles["recycle"]} src={recycle} alt="" />
                  <p className={styles["btn-delete"]}> Удалить аккаунт</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
