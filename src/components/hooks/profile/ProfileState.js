import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

export const ProfileState = (logOut) => {
  const [loading, setLoading] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [confirmDeleteEmployee, setConfirmDeleteEmployee] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const base64Key = "ECqDTm9UnVoFn2BD4vM2/Fgzda1470BvZo4t1PWAkuU=";
  const key = CryptoJS.enc.Base64.parse(base64Key);

  const decryptField = (encryptedValue) => {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedValue, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error("Ошибка при расшифровке:", e);
      return "Ошибка расшифровки";
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/clients/all");

      if (!response.ok) throw new Error("Ошибка при получении клиентов");
      const data = await response.json();

      const filteredData = data.filter(
        (clients) => clients.clientType === null
      );

      const decryptedData = filteredData.map((employee) => {
        const fieldsToDecrypt = ["email", "phone"];
        const decryptedEmployee = { ...employee };

        fieldsToDecrypt.forEach((field) => {
          if (employee[field]) {
            decryptedEmployee[field] = decryptField(employee[field]);
          }
        });

        return decryptedEmployee;
      });
      setClients(decryptedData);
    } catch (error) {
      console.error("Ошибка при загрузке клиента");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.salon-era.ru/clients?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении клиента");

      setTimeout(() => {
        setClients((prevClients) =>
          prevClients.filter((client) => client.id !== id)
        );
        closeMessageDeleteClients();
      }, 5000);
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
      logOut();
    }
  };

  const showMessageDeleteClients = (id) => {
    setClientToDelete(id);
    setConfirmDeleteEmployee(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteClients = () => {
    setConfirmDeleteEmployee(false);
    setClientToDelete(null);
    document.body.style.overflow = "scroll";
  };

  return {
    loading,
    clients,
    confirmDeleteEmployee,
    clientToDelete,
    showMessageDeleteClients,
    closeMessageDeleteClients,
    handleDelete,
  };
};
