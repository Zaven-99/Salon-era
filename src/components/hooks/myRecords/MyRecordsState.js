import { useState, useEffect } from "react";

export const MyRecordsState = (clientId) => {
  const [order, setOrder] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
        throw new Error(`http error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Полученные данные не являются массивом");
      }

      const userOrders = data.filter(
        (order) => order.clientFrom?.id === clientId
      );
      setOrder(userOrders);
    } catch (error) {
      setError(error.message);
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

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
    };
    return new Date(date).toLocaleString("ru-RU", options);
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
