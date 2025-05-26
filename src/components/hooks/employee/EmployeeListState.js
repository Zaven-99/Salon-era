import { useState, useEffect, useCallback } from "react";
import CryptoJS from "crypto-js";
const genderMap = { 0: "Женщина", 1: "Мужчина" };

export const EmployeeListState = (setEmployee) => {
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({});
  const [confirmDeleteEmployee, setConfirmDeleteEmployee] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

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

  const fetchEmployee = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.salon-era.ru/employees/role?role=USER",
        {}
      );
      if (!response.ok) throw new Error("Ошибка при получении сотрудников");

      const data = await response.json();

      const decryptedData = data.map((employee) => {
        const fieldsToDecrypt = [
          "firstName",
          "lastName",
          "password",
          "email",
          "phone",
          "role",
        ];
        const decryptedEmployee = { ...employee };

        fieldsToDecrypt.forEach((field) => {
          if (employee[field]) {
            decryptedEmployee[field] = decryptField(employee[field]);
          }
        });

        return decryptedEmployee;
      });

      const uniqueData = Array.from(
        new Map(decryptedData.map((item) => [item.id, item])).values()
      );

      setEmployee(uniqueData);
    } catch (error) {
      console.error("Ошибка при загрузке сотрудников:", error);
    } finally {
      setLoading(false);
    }
  }, [setEmployee]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleDelete = async (id) => {
    if (!id) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.salon-era.ru/employees?id=${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении сотрудника");

      setEmployee((prev) => prev.filter((emp) => emp.id !== id));
      closeMessageDeleteEmployee();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
    }
  };

  const handleEdit = (employee) => {
    setEmployeeId(employee.id);
    setEditedEmployee(employee);
  };

  const showMessageDeleteEmployee = (id) => {
    setEmployeeToDelete(id);
    setConfirmDeleteEmployee(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteEmployee = () => {
    setConfirmDeleteEmployee(false);
    setEmployeeToDelete(null);
    document.body.style.overflow = "scroll";
  };

  const getGenderText = (gender) => genderMap[gender];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
    };
    return date.toLocaleString("ru-RU", options);
  };

  const groupEmployeesByPosition = useCallback((employees) => {
    return employees.reduce((acc, employee) => {
      const { position } = employee;
      if (!acc[position]) acc[position] = [];
      acc[position].push(employee);
      return acc;
    }, {});
  }, []);

  return {
    loading,
    setLoading,
    employeeId,
    editedEmployee,
    confirmDeleteEmployee,
    employeeToDelete,
    setEmployeeId,
    setEditedEmployee,
    handleDelete,
    handleEdit,
    showMessageDeleteEmployee,
    closeMessageDeleteEmployee,
    getGenderText,
    formatDate,
    groupEmployeesByPosition,
  };
};
