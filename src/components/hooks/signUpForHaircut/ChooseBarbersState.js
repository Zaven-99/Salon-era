// hooks/useChooseABarbers.js
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectChosenBarber } from "../../../store/slices/action";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../use-auth/use-auth";
import CryptoJS from "crypto-js";

export const ChooseABarbersState = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackBarber, setFeedbackBarber] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [ratings, setRatings] = useState({});
  const [categories, setCategories] = useState([]);

  const { token } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedBarber = useSelector((state) => state.barber.selectedBarber);
  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );

  const handleClickPrev = () => {
    navigate("/");
  };

  const handleSelectBarber = (barber) => {
    dispatch(selectChosenBarber(barber));
  };

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
      return "Ошибка расшифровки";
    }
  };

  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/employees/all", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Ошибка при получении барберов");
      }
      const data = await response.json();

      const decryptedData = data.map((employee) => {
        const fieldsToDecrypt = ["last_name", "first_name"];
        const decryptedEmployee = { ...employee };

        fieldsToDecrypt.forEach((field) => {
          if (employee[field]) {
            decryptedEmployee[field] = decryptField(employee[field]);
          }
        });

        return decryptedEmployee;
      });
      setBarbers(decryptedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.salon-era.ru/feedbacks/all", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Ошибка при получении фидбеков");
      }
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const showFeedBackToggle = (barber) => {
    setFeedbackBarber((prev) =>
      prev && prev.id === barber.id ? null : barber
    );
    setFeedbackText("");
    setRatings((prevRatings) => ({
      ...prevRatings,
      [barber.id]: prevRatings[barber.id] || 0,
    }));
  };

  const fetchCategory = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/catalogs/all", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Ошибка http! статус: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = (barberId) => {
    const barberFeedbacks = feedbacks.filter(
      (f) => f.id_employee_to === barberId
    );
    if (barberFeedbacks.length === 0) return 0;
    return (
      barberFeedbacks.reduce((sum, f) => sum + f.value, 0) /
      barberFeedbacks.length
    );
  };

  const getFeedbackCount = (barberId) =>
    feedbacks.filter((f) => f.id_employee_to === barberId).length;

  const categoryOptions = categories.filter(
    (item) => item.category === "Должность"
  );

  const getCategoryTextById = (id) => {
    const category = categoryOptions.find((item) => item.id === Number(id));
    return category ? category.value : "Категория не найдена";
  };

  const filteredBarbers = useMemo(() => {
    if (selectedServices.length === 0) return [];
    return barbers.filter((barber) => {
      if (
        !Array.isArray(barber.array_type_work) ||
        barber.array_type_work.length === 0
      )
        return false;

      const selectedCategoryIds = selectedServices.map((s) => s.category);
      const isMatchingCategory = barber.array_type_work.some((id) =>
        selectedCategoryIds.includes(id)
      );
      return isMatchingCategory;
    });
  }, [barbers, selectedServices]);

  useEffect(() => {
    fetchBarbers();
    handleGetFeedback();
    fetchCategory();
  }, []);

  return {
    barbers,
    loading,
    error,
    feedbackBarber,
    feedbackText,
    feedbacks,
    ratings,
    selectedBarber,
    selectedServices,
    token,
    categoryOptions,
    filteredBarbers,
    handleClickPrev,
    handleSelectBarber,
    showFeedBackToggle,
    setFeedbackText,
    setRatings,
    setFeedbacks,
    getAverageRating,
    getFeedbackCount,
    getCategoryTextById,
    handleGetFeedback,
    setLoading,
  };
};
