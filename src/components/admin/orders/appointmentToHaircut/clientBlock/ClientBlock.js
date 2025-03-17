import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../../modal/Modal";
import ClientInfo from "./clientInfo/ClientInfo";

import BtnBlock from "../../../../btnBlock/BtnBlock";
import EditForm from "./editForm/EditForm";

import styles from "./clientBlock.module.scss";
const ClientBlock = ({
  setLoading,
  setClientToDelete,
  setConfirmDeleteClient,
  client,
  toggleOpen,
  toggleClose,
  activeInput,
  setActiveInput,
  handleKeyDown,
}) => {
  useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "",
    },
  });

  const [clientId, setClientId] = useState(null);
  const [editedClient, setEditedClient] = useState({});

  const handleEdit = (client) => {
    setClientId(client.id);
    setEditedClient(client);
  };

  const showMessageDeleteClients = (id) => {
    setClientToDelete(id);
    setConfirmDeleteClient(true);
    document.body.style.overflow = "hidden";
  };

  return (
    <div>
      {client && (
        <div className={styles["client-info"]}>
          {clientId === client.id ? (
            <Modal
              toggleOpen={toggleOpen}
              toggleClose={toggleClose}
              setEmployeeId={setClientId}
            >
              <EditForm
                setEditedClient={setEditedClient}
                editedClient={editedClient}
                setClientId={setClientId}
                activeInput={activeInput}
                setActiveInput={setActiveInput}
                handleKeyDown={handleKeyDown}
                setLoading={setLoading}
                client={client}
              />
            </Modal>
          ) : (
            <div className={styles["clientBlock"]}>
              <ClientInfo client={client} />

              <BtnBlock
                className1={styles["delete-client"]}
                className2={styles["change-client"]}
                label1="Удалить аккаунт"
                label2="Изменить аккаунт"
                fnc1={() => showMessageDeleteClients(client.id)}
                fnc2={() => handleEdit(client)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientBlock;
