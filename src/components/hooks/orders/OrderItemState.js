import { useMemo, useCallback, useState } from "react";
import { useDispatch } from "react-redux"; // Импортируем useDispatch для отправки экшенов
import { removeOrder } from "../../../store/slices/orderSlice";
export const OrderItemState = ({
  filteredOrders,
  setOrders,
  setError,
  formatDate,
}) => {
  const dispatch = useDispatch();
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);
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

  const fetchOrderById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.salon-era.ru/records/id?id=${id}`);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.warn("Ошибка при получении заказа:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(
    async (order, status) => {
      const formData = new FormData();
      formData.append(
        "clientData",
        JSON.stringify({ id: order.record.id, status })
      );
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.salon-era.ru/records/update`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) throw new Error(await response.text());

        const updated = await fetchOrderById(order.record.id);
        if (!updated) throw new Error("Не удалось загрузить обновлённый заказ");

        setOrders((prev) =>
          prev.map((o) =>
            o.record.id === updated.id ? { ...o, record: updated } : o
          )
        );
      } catch (error) {
        setError(error.message || "Неизвестная ошибка");
      } finally {
        setLoading(false);

        window.location.reload();
      }
    },
    [setOrders, setError, fetchOrderById]
  );

  const updateOrderPrice = useCallback(
    async (orderId, price) => {
      const formData = new FormData();
      formData.append(
        "clientData",
        JSON.stringify({ id: orderId, price: Number(price) })
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

        const updated = await fetchOrderById(orderId);
        if (!updated) throw new Error("Не удалось загрузить обновлённый заказ");

        setOrders((prev) =>
          prev.map((o) =>
            o.record.id === updated.id ? { ...o, record: updated } : o
          )
        );
      } catch (error) {
        setError(error.message || "Ошибка при обновлении цены");
      } finally {
        setEditingPriceId(null);
        setNewPrice("");
      }
    },
    [setOrders, setError, fetchOrderById]
  );

  const acceptOrder = useCallback(
    (order) => updateOrderStatus(order, 100),
    [updateOrderStatus]
  );

  const closeOrder = useCallback(
    (order) => {
      updateOrderStatus(order, 500);
      dispatch(removeOrder(order.record.id)); // Удаляем заказ из Redux
    },
    [updateOrderStatus, dispatch]
  );

  const cancelOrder = useCallback(
    (order) => {
      updateOrderStatus(order, 400);
      dispatch(removeOrder(order.record.id)); // Удаляем заказ из Redux
    },
    [updateOrderStatus, dispatch]
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
    loading,
  };
};
