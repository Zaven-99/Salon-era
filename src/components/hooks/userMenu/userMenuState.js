import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

export const useUserMenuState = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

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
        const fieldsToDecrypt = [
          "lastName",
          "firstName",
          "login",
          "email",
          "phone",
        ];
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

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients };
};
