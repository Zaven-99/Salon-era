import { useState, useEffect } from "react";
import { useAuth } from "../../../use-auth/use-auth";

import CryptoJS from "crypto-js";

export const MyRecordsState = (clientId) => {
  const [order, setOrder] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useAuth();

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
      // console.error("Ошибка при расшифровке:", e);
      return "Ошибка";
    }
  };

  const decryptOrder = (order) => {
    const decryptedOrder = { ...order };

    if (order.clientFrom) {
      decryptedOrder.clientFrom = {
        ...order.clientFrom,
        firstName: decryptField(order.clientFrom.firstName),
        lastName: decryptField(order.clientFrom.lastName),
      };
    }

    if (order.employeeTo) {
      decryptedOrder.employeeTo = {
        ...order.employeeTo,
        firstName: decryptField(order.employeeTo.firstName),
        lastName: decryptField(order.employeeTo.lastName),
      };
    }

    return decryptedOrder;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.salon-era.ru/records/all/filter?field=id_client_from&state=eq&value=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      const decryptedData = data.map(decryptOrder);

      if (!Array.isArray(decryptedData)) {
        throw new Error("Полученные данные не являются массивом");
      }

      const userOrders = decryptedData.filter(
        (order) => order.clientFrom?.id === clientId
      );
      setOrder(userOrders);
    } catch (error) {
      console.log(error.message);

      // setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (order) => {
    setLoading(true);
    if (!order || !order.record || !order.record.id) {
      setError("Некорректные данные для отмены заказа");
      return;
    }

    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify({
        id: order.record.id,
        status: 400,
      })
    );

    try {
      const response = await fetch(`https://api.salon-era.ru/records/update`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка HTTP! статус: ${response.status}, сообщение: ${errorText}`
        );
      }

      const updatedOrder = await response.json();
      setOrder((prevOrders) =>
        prevOrders.map((o) =>
          o.record.id === updatedOrder.id ? updatedOrder : o
        )
      );
    } catch (error) {
      setError(error.message || "Неизвестная ошибка");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const formatDate = (utcDateString) => {
    // Если строка не содержит суффикса Z, добавим его
    const utcStringWithZ = utcDateString.endsWith("Z")
      ? utcDateString
      : utcDateString + "Z";

    const d = new Date(utcStringWithZ);

    return `${d.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}, ${d.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };

  const totalAllOrders = order.reduce(
    (acc, current) => acc + (current.service?.priceLow || 0),
    0
  );

  const totalCancelledOrders = order
    .filter((orderItem) => orderItem.record?.status === 400)
    .reduce((acc, current) => acc + (current.service?.priceLow || 0), 0);

  const total = totalAllOrders - totalCancelledOrders;

  useEffect(() => {
    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  return { loading, order, error, cancelOrder, formatDate, total };
};
