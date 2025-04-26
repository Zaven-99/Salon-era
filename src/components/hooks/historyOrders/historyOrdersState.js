import { useEffect, useState } from "react";

export const HistoryOrdersState = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

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
        data.sort(
          (a, b) =>
            new Date(b.record.dateRecord) - new Date(a.record.dateRecord)
        );
        setOrders(data);
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
