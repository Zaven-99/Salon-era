import { useState, useEffect, useMemo } from "react";
import AOS from "aos";
import CryptoJS from "crypto-js";

export const EmployeeState = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState([]);

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

  const fetchPosition = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.salon-era.ru/catalogs/all/filter?field=category&state=eq&value=должность"
      );
      if (!response.ok) throw new Error("Ошибка при загрузке категорий");
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/employees/all");
      if (!response.ok) {
        throw new Error("Ошибка при получении барберов");
      }

      const data = await response.json();

      const decryptedData = data.map((employee) => {
        const fieldsToDecrypt = ["lastName", "firstName"];
        const decryptedEmployee = { ...employee };

        fieldsToDecrypt.forEach((field) => {
          if (employee[field]) {
            decryptedEmployee[field] = decryptField(employee[field]);
          }
        });

        return decryptedEmployee;
      });
      setBarbers(decryptedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPositionTextById = (id) => {
    const categoryId = Number(id);
    const category = positions.find((item) => item.id === categoryId);
    return category ? category.value : "Категория не найдена";
  };

  const filteredBarbers = useMemo(
    () => barbers.filter((barber) => barber.login !== "admin"),
    [barbers]
  );

  useEffect(() => {
    fetchPosition();
    fetchBarbers();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, offset: 300 });
  }, []);

  return {
    filteredBarbers,
    getPositionTextById,
    loading,
    error,
  };
};
