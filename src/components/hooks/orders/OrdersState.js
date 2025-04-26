import { useEffect, useRef, useState } from "react";

export const OrdersState = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [addOrderModal, setAddOrderModal] = useState(false);
  const [ws, setWs] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const notificationSound = new Audio("/sound.mp3");
  const previousOrdersRef = useRef(null);

  const formatDate = (date) => {
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };

    const formattedDate = new Date(date).toLocaleDateString(
      "ru-RU",
      dateOptions
    );
    const formattedTime = new Date(date).toLocaleTimeString(
      "ru-RU",
      timeOptions
    );

    return `${formattedDate}, ${formattedTime}`;
  };

  const filterOrdersByDate = (date, ordersList) => {
    const ordersToFilter = ordersList || orders;

    if (!date) {
      setFilteredOrders(
        ordersToFilter.filter(
          (order) =>
            order.record?.status !== 400 && order.record?.status !== 500
        )
      );
    } else {
      const formattedDate = formatDate(date).split(",")[0];
      setFilteredOrders(
        ordersToFilter.filter(
          (order) =>
            formatDate(order.record?.dateRecord).split(",")[0] ===
              formattedDate &&
            order.record?.status !== 400 &&
            order.record?.status !== 500
        )
      );
    }
  };

  useEffect(() => {
    let socket = null;
    let reconnectTimeout = null;

    const connect = () => {
      socket = new WebSocket("wss://api.salon-era.ru/websocket/records");

      socket.onopen = () => {
        console.log("WebSocket открыт");
        setError(null);
        setLoading(false);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (previousOrdersRef.current) {
            const newOrdersCount = data.length;
            const previousOrdersCount = previousOrdersRef.current.length;

            if (newOrdersCount > previousOrdersCount) {
              notificationSound
                .play()
                .catch((e) => console.warn("Ошибка звука:", e));
              setNotificationVisible(true);
              setTimeout(() => setNotificationVisible(false), 3000);
            }
          }

          previousOrdersRef.current = data;
          setOrders(data);
        } catch (e) {
          console.error("Ошибка парсинга WebSocket:", e);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket ошибка:", err);
        setError("Ошибка подключения к WebSocket");
      };

      socket.onclose = (event) => {
        console.warn("WebSocket закрыт", event.code, event.reason);
        setError("WebSocket соединение закрыто");

        reconnectTimeout = setTimeout(() => {
          console.log("Переподключение к WebSocket...");
          connect();
        }, 5000);
      };

      setWs(socket);
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        socket.close(1000, "Компонент размонтирован");
      }
    };
  }, []);

  useEffect(() => {
    filterOrdersByDate(selectedDate);
  }, [orders, selectedDate]);

  const toggleOpen = () => {
    setAddOrderModal(true);
    document.body.style.overflow = "hidden";
  };

  return {
    orders,
    setOrders,
    filteredOrders,
    error,
    loading,
    selectedDate,
    setSelectedDate,
    addOrderModal,
    setAddOrderModal,
    ws,
    notificationVisible,
    toggleOpen,
    filterOrdersByDate,
    formatDate,
    setError,
  };
};














// import { useEffect, useRef, useState } from "react";

// export const OrdersState = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [addOrderModal, setAddOrderModal] = useState(false);
//   const [notificationVisible, setNotificationVisible] = useState(false);

//   // ссылка на звук уведомления
//   const notificationSound = useRef(new Audio("/sound.mp3")).current;
//   // предыдущее количество заказов
//   const prevCountRef = useRef(0);

//   // формат даты/времени
//   const formatDate = (date) => {
//     const dateOpts = { year: "numeric", month: "long", day: "numeric" };
//     const timeOpts = { hour: "2-digit", minute: "2-digit", hour12: false };
//     const d = new Date(date);
//     return `${d.toLocaleDateString("ru-RU", dateOpts)}, ${d.toLocaleTimeString(
//       "ru-RU",
//       timeOpts
//     )}`;
//   };

//   // функция фильтрации по статусам и выбранному дню
//   const applyFilter = (list, date) => {
//     const day = date ? formatDate(date).split(",")[0] : null;
//     return list.filter((o) => {
//       const s = o.record?.status;
//       if (s === 400 || s === 500) return false;
//       if (!day) return true;
//       return formatDate(o.record.dateRecord).split(",")[0] === day;
//     });
//   };

//   useEffect(() => {
//     let es;
//     let reconnectTimer;

//     const connectSSE = () => {
//       es = new EventSource("https://api.salon-era.ru/websocket/records/sse");

//       es.onopen = () => {
//         setError(null);
//         setLoading(false);
//       };

//       es.onmessage = (e) => {
//         let data;
//         try {
//           data = JSON.parse(e.data);
//         } catch {
//           console.error("Ошибка парсинга SSE данных");
//           return;
//         }

//         // если добавились новые
//         if (data.length > prevCountRef.current) {
//           notificationSound.play().catch(() => {});
//           setNotificationVisible(true);
//           setTimeout(() => setNotificationVisible(false), 3000);
//         }

//         prevCountRef.current = data.length;
//         setOrders(data);
//       };

//       es.onerror = () => {
//         setError("Ошибка SSE, переподключение…");
//         es.close();
//         reconnectTimer = setTimeout(connectSSE, 5000);
//       };
//     };

//     connectSSE();

//     return () => {
//       clearTimeout(reconnectTimer);
//       if (es) es.close();
//     };
//   }, [notificationSound]);

//   // обновляем filteredOrders при получении новых orders или смене даты
//   useEffect(() => {
//     setFilteredOrders(applyFilter(orders, selectedDate));
//   }, [orders, selectedDate]);

//   const toggleOpen = () => {
//     setAddOrderModal(true);
//     document.body.style.overflow = "hidden";
//   };

//   return {
//     orders,
//     filteredOrders,
//     loading,
//     error,
//     selectedDate,
//     setSelectedDate,
//     addOrderModal,
//     toggleOpen,
//     notificationVisible,
//     formatDate,
//     setError,
//   };
// };
