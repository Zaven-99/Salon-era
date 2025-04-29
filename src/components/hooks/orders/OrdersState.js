// import { useEffect, useRef, useState } from "react";
// import CryptoJS from "crypto-js";
// import { toast } from "react-toastify";

// export const useOrdersState = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [addOrderModal, setAddOrderModal] = useState(false);
//   const [ws, setWs] = useState(null);
//   const hasMounted = useRef(false);
//   const previousOrdersLengthRef = useRef(0);
//   const [notificationMessage, setNotificationMessage] = useState("");
//   const notificationSound = new Audio("/sound.mp3");
//   const initialLoadRef = useRef(true);

//   useEffect(() => {
//     const initialLoad = sessionStorage.getItem("ordersInitialLoad");
//     if (initialLoad === "done") {
//       initialLoadRef.current = false;
//     }
//   }, []);

//   const base64Key = "ECqDTm9UnVoFn2BD4vM2/Fgzda1470BvZo4t1PWAkuU=";
//   const key = CryptoJS.enc.Base64.parse(base64Key);

//   const decryptField = (encryptedValue) => {
//     try {
//       const decrypted = CryptoJS.AES.decrypt(encryptedValue, key, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7,
//       });
//       return decrypted.toString(CryptoJS.enc.Utf8);
//     } catch (e) {
//       console.error("Ошибка при расшифровке:", e);
//       return "Ошибка";
//     }
//   };

//   const formatDate = (date) => {
//     const dateOptions = { year: "numeric", month: "long", day: "numeric" };
//     const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
//     const formattedDate = new Date(date).toLocaleDateString(
//       "ru-RU",
//       dateOptions
//     );
//     const formattedTime = new Date(date).toLocaleTimeString(
//       "ru-RU",
//       timeOptions
//     );
//     return `${formattedDate}, ${formattedTime}`;
//   };

//   const filterOrdersByDate = (date, ordersList) => {
//     const ordersToFilter = ordersList || orders;
//     if (!date) {
//       setFilteredOrders(
//         ordersToFilter.filter(
//           (order) =>
//             order.record?.status !== 400 && order.record?.status !== 500
//         )
//       );
//     } else {
//       const formattedDate = formatDate(date).split(",")[0];
//       setFilteredOrders(
//         ordersToFilter.filter(
//           (order) =>
//             formatDate(order.record?.dateRecord).split(",")[0] ===
//               formattedDate &&
//             order.record?.status !== 400 &&
//             order.record?.status !== 500
//         )
//       );
//     }
//   };

//   useEffect(() => {
//     let socket = null;
//     let reconnectTimeout = null;

//     const connect = () => {
//       socket = new WebSocket("wss://api.salon-era.ru/websocket/records");

//       socket.onopen = () => {
//         console.log("WebSocket открыт");
//         setError(null);
//         setLoading(false);
//       };

//       socket.onmessage = async (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           console.log("Полученные данные:", data);

//           const updatedOrders = await Promise.all(
//             data.map(async (order) => {
//               const hasDecryptedClient =
//                 order.clientFrom?.firstName && order.clientTo?.firstName;

//               if (hasDecryptedClient) {
//                 return {
//                   ...order,
//                   clientFrom: {
//                     ...order.clientFrom,
//                     firstName: decryptField(order.clientFrom.firstName),
//                     lastName: decryptField(order.clientFrom.lastName),
//                   },
//                   clientTo: {
//                     ...order.clientTo,
//                     firstName: decryptField(order.clientTo.firstName),
//                     lastName: decryptField(order.clientTo.lastName),
//                   },
//                 };
//               }

//               if (order.record?.id) {
//                 try {
//                   const res = await fetch(
//                     `https://api.salon-era.ru/records/id?id=${order.record.id}`
//                   );
//                   const fullOrder = await res.json();
//                   return {
//                     ...fullOrder,
//                     clientFrom: {
//                       ...fullOrder.clientFrom,
//                       firstName: decryptField(fullOrder.clientFrom.firstName),
//                       lastName: decryptField(fullOrder.clientFrom.lastName),
//                     },
//                     clientTo: {
//                       ...fullOrder.clientTo,
//                       firstName: decryptField(fullOrder.clientTo.firstName),
//                       lastName: decryptField(fullOrder.clientTo.lastName),
//                     },
//                   };
//                 } catch (apiErr) {
//                   console.error(
//                     "Ошибка получения полной версии заказа:",
//                     apiErr
//                   );
//                   return order;
//                 }
//               }

//               return order;
//             })
//           );

//           setOrders((prev) => {
//             const map = new Map(prev.map((o) => [o.record?.id, o]));
//             updatedOrders.forEach((o) => {
//               if (o.record?.id) map.set(o.record.id, o);
//             });

//             const newOrders = Array.from(map.values());

//             filterOrdersByDate(selectedDate, newOrders);

//             if (
//               hasMounted.current &&
//               newOrders.length > previousOrdersLengthRef.current &&
//               !initialLoadRef.current
//             ) {
//               const newOrder = updatedOrders[0];

//               setNotificationMessage(
//                 `Новый заказ от ${newOrder.clientFrom?.firstName || "Клиент"} ${
//                   newOrder.clientFrom?.lastName || ""
//                 }`
//               );

//               toast.info(
//                 `Новый заказ от ${newOrder.clientFrom?.firstName || "Клиент"} ${
//                   newOrder.clientFrom?.lastName || ""
//                 }`
//               );

//               notificationSound
//                 .play()
//                 .catch((e) => console.warn("Ошибка звука:", e));
//             }

//             previousOrdersLengthRef.current = newOrders.length;
//             hasMounted.current = true;

//             if (initialLoadRef.current) {
//               initialLoadRef.current = false;
//               sessionStorage.setItem("ordersInitialLoad", "done");
//             }

//             return newOrders;
//           });
//         } catch (e) {
//           console.error("Ошибка обработки WebSocket сообщения:", e);
//         }
//       };

//       socket.onerror = (err) => {
//         console.error("WebSocket ошибка:", err);
//       };

//       socket.onclose = (event) => {
//         console.warn("WebSocket закрыт", event.code, event.reason);
//         reconnectTimeout = setTimeout(() => {
//           console.log("Переподключение к WebSocket...");
//           connect();
//         }, 5000);
//       };

//       setWs(socket);
//     };

//     connect();

//     return () => {
//       if (reconnectTimeout) clearTimeout(reconnectTimeout);
//       if (
//         socket &&
//         (socket.readyState === WebSocket.OPEN ||
//           socket.readyState === WebSocket.CONNECTING)
//       ) {
//         socket.close(1000, "Компонент размонтирован");
//       }
//     };
//   }, []);

//   useEffect(() => {
//     filterOrdersByDate(selectedDate);
//   }, [orders, selectedDate]);

//   const toggleOpen = () => {
//     setAddOrderModal(true);
//     document.body.style.overflow = "hidden";
//   };

//   return {
//     orders,
//     setOrders,
//     filteredOrders,
//     error,
//     loading,
//     selectedDate,
//     setSelectedDate,
//     addOrderModal,
//     setAddOrderModal,
//     ws,
//     notificationMessage,
//     toggleOpen,
//     filterOrdersByDate,
//     formatDate,
//     setError,
//   };
// };

import { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux"; // Импортируем dispatch

import { saveOrder } from "../../../store/slices/orderSlice"; // Импортируем экшен saveOrder

export const useOrdersState = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [addOrderModal, setAddOrderModal] = useState(false);
  const [ws, setWs] = useState(null);
  const hasMounted = useRef(false);
  const previousOrdersLengthRef = useRef(0);
  const [notificationMessage, setNotificationMessage] = useState("");
  const notificationSound = new Audio("/sound.mp3");
  const initialLoadRef = useRef(true);

  const dispatch = useDispatch(); // Инициализация dispatch

  useEffect(() => {
    const initialLoad = sessionStorage.getItem("ordersInitialLoad");
    if (initialLoad === "done") {
      initialLoadRef.current = false;
    }
  }, []);

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
      return "Ошибка";
    }
  };

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

      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Полученные данные:", data);

          const updatedOrders = await Promise.all(
            data.map(async (order) => {
              const hasDecryptedClient =
                order.clientFrom?.firstName && order.clientTo?.firstName;

              if (hasDecryptedClient) {
                return {
                  ...order,
                  clientFrom: {
                    ...order.clientFrom,
                    firstName: decryptField(order.clientFrom.firstName),
                    lastName: decryptField(order.clientFrom.lastName),
                  },
                  clientTo: {
                    ...order.clientTo,
                    firstName: decryptField(order.clientTo.firstName),
                    lastName: decryptField(order.clientTo.lastName),
                  },
                };
              }

              if (order.record?.id) {
                try {
                  const res = await fetch(
                    `https://api.salon-era.ru/records/id?id=${order.record.id}`
                  );
                  const fullOrder = await res.json();
                  return {
                    ...fullOrder,
                    clientFrom: {
                      ...fullOrder.clientFrom,
                      firstName: decryptField(fullOrder.clientFrom.firstName),
                      lastName: decryptField(fullOrder.clientFrom.lastName),
                    },
                    clientTo: {
                      ...fullOrder.clientTo,
                      firstName: decryptField(fullOrder.clientTo.firstName),
                      lastName: decryptField(fullOrder.clientTo.lastName),
                    },
                  };
                } catch (apiErr) {
                  console.error(
                    "Ошибка получения полной версии заказа:",
                    apiErr
                  );
                  return order;
                }
              }

              return order;
            })
          );

          setOrders((prev) => {
            const map = new Map(prev.map((o) => [o.record?.id, o]));
            updatedOrders.forEach((o) => {
              if (o.record?.id) map.set(o.record.id, o);
            });

            const newOrders = Array.from(map.values());

            filterOrdersByDate(selectedDate, newOrders);

            if (
              hasMounted.current &&
              newOrders.length > previousOrdersLengthRef.current &&
              !initialLoadRef.current
            ) {
              const newOrder = updatedOrders[0];

              setNotificationMessage(
                `Новый заказ от ${newOrder.clientFrom?.firstName || "Клиент"} ${
                  newOrder.clientFrom?.lastName || ""
                }`
              );

              toast.info(
                `Новый заказ от ${newOrder.clientFrom?.firstName || "Клиент"} ${
                  newOrder.clientFrom?.lastName || ""
                }`
              );

              notificationSound
                .play()
                .catch((e) => console.warn("Ошибка звука:", e));

              // Сохраняем заказ в Redux
              dispatch(saveOrder(newOrder));
            }

            previousOrdersLengthRef.current = newOrders.length;
            hasMounted.current = true;

            if (initialLoadRef.current) {
              initialLoadRef.current = false;
              sessionStorage.setItem("ordersInitialLoad", "done");
            }

            return newOrders;
          });
        } catch (e) {
          console.error("Ошибка обработки WebSocket сообщения:", e);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket ошибка:", err);
      };

      socket.onclose = (event) => {
        console.warn("WebSocket закрыт", event.code, event.reason);
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
  }, [dispatch]); // Добавили dispatch как зависимость

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
    notificationMessage,
    toggleOpen,
    filterOrdersByDate,
    formatDate,
    setError,
  };
};
