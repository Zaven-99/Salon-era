import { useForm } from "react-hook-form";
import { useState } from "react";
import CryptoJS from "crypto-js";

export const SearchClient = ({ setClient, setOfferModal }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
  });

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

  const handleSearchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/clients/all", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных на сервер");
      }

      const clients = await response.json();
      const phoneNumber = watch("phone");

      const foundClient = clients.find(
        (client) => decryptField(client.phone) === phoneNumber
      );

      if (foundClient) {
        const fieldsToDecrypt = ["firstName", "lastName", "email", "phone"];
        const decryptedClient = { ...foundClient };

        fieldsToDecrypt.forEach((field) => {
          if (decryptedClient[field]) {
            decryptedClient[field] = decryptField(decryptedClient[field]);
          }
        });

        setClient(decryptedClient);
      } else {
        setOfferModal(true);
      }
    } catch (error) {
      alert("Извините, произошла ошибка!");
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    watch,
    errors,
    loading,
    handleSearchClients,
  };
};
 
