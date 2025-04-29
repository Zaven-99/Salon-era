import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

export const HistoryOrdersState = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

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

  const decryptOrder = (order) => {
    const decryptedOrder = { ...order };

    if (order.clientFrom) {
      decryptedOrder.clientFrom = {
        ...order.clientFrom,
        firstName: decryptField(order.clientFrom.firstName),
        lastName: decryptField(order.clientFrom.lastName),
      };
    }

    if (order.clientTo) {
      decryptedOrder.clientTo = {
        ...order.clientTo,
        firstName: decryptField(order.clientTo.firstName),
        lastName: decryptField(order.clientTo.lastName),
      };
    }

    return decryptedOrder;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://api.salon-era.ru/records/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`https error! status: ${response.status}`);
        }

        const data = await response.json();

        const decryptedData = data.map(decryptOrder);

        decryptedData.sort(
          (a, b) =>
            new Date(b.record.dateRecord) - new Date(a.record.dateRecord)
        );
        setOrders(decryptedData);
        console.log(decryptedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
    };
    return new Date(date).toLocaleString("ru-RU", options);
  };

  const filteredOrders = selectedDate
    ? orders.filter((order) => {
        const orderDate = new Date(order.record.dateRecord);
        return (
          orderDate.toDateString() === new Date(selectedDate).toDateString()
        );
      })
    : orders;

  const calculateTotal = () => {
    const totalAllOrders = filteredOrders
      .filter((orderItem) => orderItem.record?.status !== 400)
      .reduce((acc, current) => acc + (current.record?.price || 0), 0);

    return totalAllOrders;
  };

  const total = calculateTotal();

  return {
    orders,
    filteredOrders,
    selectedDate,
    setSelectedDate,
    loading,
    error,
    total,
    formatDate,
  };
};
