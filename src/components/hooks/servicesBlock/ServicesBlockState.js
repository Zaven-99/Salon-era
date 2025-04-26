import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addService,
  removeService,
} from "../../../store/slices/serviceSlice";

export const ServicesBlockState = ({
  addOrderModal,
  services,
  setServices,
  selectedCategory,
}) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );
  const dispatch = useDispatch();

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.gender]) {
      acc[service.gender] = {};
    }
    if (!acc[service.gender][service.category]) {
      acc[service.gender][service.category] = [];
    }
    acc[service.gender][service.category].push(service);
    return acc;
  }, {});

  const toggleChooseService = (serviceId, category) => {
    if (!serviceId) return;

    const service = services.find(
      (s) =>
        s.id === Number(serviceId) && String(s.category) === String(category)
    );
    if (!service) return;

    const isServiceSelected = selectedServices.some((s) => s.id === service.id);
    if (isServiceSelected) {
      dispatch(removeService(service.id)); // Удаление услуги из Redux
    } else {
      dispatch(addService(service)); // Добавление услуги в Redux
    }
  };

  const filteredGroupedServices = selectedCategory
    ? Object.keys(groupedServices).reduce((acc, genderKey) => {
        if (!groupedServices[genderKey]) return acc;
        acc[genderKey] = Object.keys(groupedServices[genderKey]).reduce(
          (categoryAcc, category) => {
            if (selectedCategory === category) {
              categoryAcc[category] = groupedServices[genderKey][category];
            }
            return categoryAcc;
          },
          {}
        );
        return acc;
      }, {})
    : groupedServices;

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.salon-era.ru/services/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка: ${response.status} - ${response.statusText} (${errorText})`
        );
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Ожидался JSON, но сервер вернул: ${contentType}`);
      }
      const data = await response.json();

      setServices(data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (addOrderModal) {
      fetchServices();
    }
  }, [addOrderModal]);

  return {
    loading,
    error,
    filteredGroupedServices,
    toggleChooseService,
    selectedServices,
  };
};
