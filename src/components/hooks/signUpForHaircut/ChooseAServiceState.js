import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  addService,
  removeService,
} from "../../../store/slices/serviceSlice";
import AOS from "aos";

export const ChooseAServiceState = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );

  useEffect(() => {
    AOS.init({ duration: 500, once: false, offset: 10 });
  }, []);

  useEffect(() => {
    fetchServices();
    fetchCategory();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.salon-era.ru/services/all");
      if (!response.ok) throw new Error("Ошибка при получении услуг");
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/catalogs/all");
      if (!response.ok) throw new Error("Ошибка при получении категорий");
      const data = await response.json();
      setCategories(data);
    } catch {
      setError("Ошибка при получении категорий");
    }
  };

  const toggleChooseService = (service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    isSelected
      ? dispatch(removeService(service.id))
      : dispatch(addService(service));
  };

  const getHourText = (hours) => {
    if (hours === 1) return "час";
    if (hours >= 2 && hours <= 4) return "часа";
    return "часов";
  };

  const getDurationText = (step) => {
    const hours = Math.floor(step / 2);
    const minutes = (step % 2) * 30;
    let result = hours > 0 ? `${hours} ${getHourText(hours)}` : "";
    if (minutes > 0) result += ` ${minutes} минут`;
    return result.trim();
  };

  const getCategoryTextById = (id) => {
    const category = categories.find((item) => item.id === Number(id));
    return category ? category.value : "Категория не найдена";
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.gender]) acc[service.gender] = {};
    if (!acc[service.gender][service.category])
      acc[service.gender][service.category] = [];
    acc[service.gender][service.category].push(service);
    return acc;
  }, {});

  const uniqueCategories = [...new Set(services.map((s) => s.category))];

  const filteredGroupedServices = Object.keys(groupedServices).reduce(
    (acc, genderKey) => {
      acc[genderKey] = Object.keys(groupedServices[genderKey]).reduce(
        (catAcc, category) => {
          if (!selectedCategory || selectedCategory === category) {
            catAcc[category] = groupedServices[genderKey][category];
          }
          return catAcc;
        },
        {}
      );
      return acc;
    },
    {}
  );

  return {
    services,
    loading,
    error,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedServices,
    toggleChooseService,
    getDurationText,
    getCategoryTextById,
    filteredGroupedServices,
    uniqueCategories,
    navigate,
  };
};
