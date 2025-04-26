import { useState, useEffect, useRef } from "react";

const useOrders = (id) => {
  const [order, setOrder] = useState([]);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    const socket = new WebSocket("wss://api.salon-era.ru/websocket/records");
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket подключен");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (!Array.isArray(data)) {
          console.warn("Неверный формат данных:", data);
          return;
        }

        const filtered = data.filter((order) => order.clientFrom?.id === id);
        setOrder(filtered);
      } catch (err) {
        console.error("Ошибка обработки WebSocket-сообщения:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket ошибка:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket закрыт");
    };

    return () => {
      socket.close();
    };
  }, [id]);

  const toggleNotification = async () => {
    if (isOpenNotification) {
      await updateView();
    }
    setIsOpenNotification((prev) => !prev);
  };

  const updateView = async () => {
    try {
      const updatedOrders = [...order];
      for (const orderItem of order) {
        if (!orderItem.record.statusViewed) {
          const formData = new FormData();
          formData.append(
            "clientData",
            JSON.stringify({
              id: orderItem.record.id,
              statusViewed: true,
            })
          );

          const response = await fetch(
            `https://api.salon-era.ru/records/update`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            const index = updatedOrders.findIndex(
              (item) => item.record.id === orderItem.record.id
            );
            if (index !== -1) {
              updatedOrders[index].record.statusViewed = true;
            }
          } else {
            const errorText = await response.text();
            throw new Error(
              `Ошибка HTTP! статус: ${response.status}, сообщение: ${errorText}`
            );
          }
        }
      }
      setOrder(updatedOrders);
    } catch (error) {
      console.log(error.message || "Неизвестная ошибка");
    }
  };

  const statusViewedCount = order.reduce(
    (count, item) => (item.record.statusViewed ? count : count + 1),
    0
  );

  return {
    order,
    toggleNotification,
    isOpenNotification,
    statusViewedCount,
  };
};

export default useOrders;
