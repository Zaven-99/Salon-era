import { useState, useEffect } from "react";

export const ServiceListState = (setError, setServices, services) => {
  const [serviceId, setServiceId] = useState(null);
  const [editedService, setEditedService] = useState({});
  const [confirmDeleteService, setConfirmDeleteService] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const genderMap = { 0: "Женский", 1: "Мужской" };
  const getGenderText = (gender) => genderMap[gender];

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/services/all");
      if (!response.ok) throw new Error("Ошибка при получении услуг");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setError("Ошибка при загрузке услуг");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchServices();
    })();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    if (serviceToDelete === null) return;
    try {
      const response = await fetch(
        `https://api.salon-era.ru/services?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении услуги");
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== id)
      );
    } catch (error) {
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
    }
  };

  const handleEdit = (service) => {
    setServiceId(service.id);
    setEditedService(service);
  };

  const showMessageDeleteService = (id) => {
    setServiceToDelete(id);
    setConfirmDeleteService(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteService = () => {
    setServiceToDelete(null);
    setConfirmDeleteService(false);
    document.body.style.overflow = "scroll";
  };

   const groupedServices = services.reduce((acc, service) => {
     const { category, gender } = service;
     if (!acc[gender]) acc[gender] = {};
     if (!acc[gender][category]) acc[gender][category] = [];
     acc[gender][category].push(service);
     return acc;
   }, {});

  return {
    serviceId,
    editedService,
    confirmDeleteService,
    serviceToDelete,
    loading,
    setServiceId,
    setEditedService,
    setConfirmDeleteService,
    setServiceToDelete,
    setLoading,
    getGenderText,
    fetchServices,
    handleDelete,
    handleEdit,
    showMessageDeleteService,
    closeMessageDeleteService,
    groupedServices,
  };
};
