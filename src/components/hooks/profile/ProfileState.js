import { useState, useEffect } from "react";

export const ProfileState = (logOut) => {
  const [loading, setLoading] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [confirmDeleteEmployee, setConfirmDeleteEmployee] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/clients/all");

      if (!response.ok) throw new Error("Ошибка при получении клиентов");
      const data = await response.json();

      const filteredData = data.filter(
        (clients) => clients.clientType === null
      );
      setClients(filteredData);
    } catch (error) {
      console.error("Ошибка при загрузке клиента");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.salon-era.ru/clients?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении клиента");

      setTimeout(() => {
        setClients((prevClients) =>
          prevClients.filter((client) => client.id !== id)
        );
        closeMessageDeleteClients();
      }, 5000);
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
      logOut();
    }
  };

  const showMessageDeleteClients = (id) => {
    setClientToDelete(id);
    setConfirmDeleteEmployee(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteClients = () => {
    setConfirmDeleteEmployee(false);
    setClientToDelete(null);
    document.body.style.overflow = "scroll";
  };

  return {
    loading,
    clients,
    confirmDeleteEmployee,
    clientToDelete,
    showMessageDeleteClients,
    closeMessageDeleteClients,
    handleDelete,
  };
};
