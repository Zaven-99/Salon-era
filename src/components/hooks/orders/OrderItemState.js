import { useMemo, useCallback, useState } from "react";

export const OrderItemState = ({
  filteredOrders,
  setOrders,
  setError,
  formatDate,
}) => {
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  const getHourText = useCallback((hours) => {
    if (hours === 1) return "час";
    if (hours >= 2 && hours <= 4) return "часа";
    return "часов";
  }, []);

  const durationToText = useCallback(
    (step) => {
      const hours = Math.floor(step / 2);
      const minutes = (step % 2) * 30;
      let result = "";
      if (hours > 0) result += `${hours} ${getHourText(hours)}`;
      if (minutes > 0) result += ` ${minutes} минут`;
      return result.trim();
    },
    [getHourText]
  );

  const updateOrderStatus = useCallback(
    async (order, status) => {
      const formData = new FormData();
      formData.append(
        "clientData",
        JSON.stringify({ id: order.record.id, status })
      );
      try {
        const response = await fetch(
          `https://api.salon-era.ru/records/update`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) throw new Error(await response.text());
        const updatedOrder = await response.json();
        setOrders((prev) =>
          prev.map((o) => (o.record.id === updatedOrder.id ? updatedOrder : o))
        );
      } catch (error) {
        setError(error.message || "Неизвестная ошибка");
      } finally {
        window.location.reload();
      }
    },
    [setOrders, setError]
  );

  const updateOrderPrice = useCallback(
    async (orderId, price) => {
      const formData = new FormData();
      formData.append(
        "clientData",
        JSON.stringify({
          id: orderId,
          price: Number(price),
        })
      );
      try {
        const response = await fetch(
          `https://api.salon-era.ru/records/update`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) throw new Error(await response.text());
        const updatedOrder = await response.json();
        setOrders((prev) =>
          prev.map((o) =>
            o.record.id === updatedOrder.id
              ? { ...o, record: { ...o.record, price: updatedOrder.price } }
              : o
          )
        );
      } catch (error) {
        setError(error.message || "Ошибка при обновлении цены");
      } finally {
        setEditingPriceId(null);
        setNewPrice("");
      }
    },
    [setOrders, setError]
  );

  const acceptOrder = useCallback(
    (order) => updateOrderStatus(order, 100),
    [updateOrderStatus]
  );

  const closeOrder = useCallback(
    (order) => updateOrderStatus(order, 500),
    [updateOrderStatus]
  );

  const cancelOrder = useCallback(
    (order) => updateOrderStatus(order, 400),
    [updateOrderStatus]
  );

  const groupOrdersByDate = useCallback(
    (orders) =>
      orders.reduce((acc, order) => {
        if (order.record?.status !== 400 && order.record?.status !== 500) {
          const date = formatDate(order.record?.dateRecord).split(",")[0];
          if (!acc[date]) acc[date] = [];
          acc[date].push(order);
        }
        return acc;
      }, {}),
    [formatDate]
  );

  const groupedOrders = useMemo(
    () => groupOrdersByDate(filteredOrders),
    [filteredOrders, groupOrdersByDate]
  );

  return {
    durationToText,
    acceptOrder,
    closeOrder,
    cancelOrder,
    groupedOrders,
    editingPriceId,
    setEditingPriceId,
    newPrice,
    setNewPrice,
    updateOrderPrice,
  };
};

