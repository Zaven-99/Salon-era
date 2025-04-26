import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearBarber } from "../../../store/slices/barberSlice.js";
import { clearServices } from "../../../store/slices/serviceSlice.js";
import CryptoJS from "crypto-js";

export const AppointmentToHaircutState = ({ setAddOrderModal }) => {
  const dispatch = useDispatch();

  const [activeInput, setActiveInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [services, setServices] = useState([]);
  const [client, setClient] = useState(null);
  const [offerModal, setOfferModal] = useState(false);
  const [succesDelete, setSuccesDelete] = useState(false);
  const [succesSignUp, setSuccesSignUp] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [confirmDeleteClient, setConfirmDeleteClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [categories, setCategories] = useState([]);
  const [barbers, setBarbers] = useState([]);

  const selectedBarber = useSelector((state) => state.barber.selectedBarber);
  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barbersResponse, categoriesResponse] = await Promise.all([
          fetch("https://api.salon-era.ru/clients/all"),
          fetch("https://api.salon-era.ru/catalogs/all"),
        ]);

        if (!barbersResponse.ok || !categoriesResponse.ok) {
          throw new Error("Ошибка загрузки данных");
        }

        const barbersData = await barbersResponse.json();
        const categoriesData = await categoriesResponse.json();

        const decryptedData = barbersData.map((employee) => {
          const fieldsToDecrypt = ["lastName", "firstName"];
          const decryptedEmployee = { ...employee };

          fieldsToDecrypt.forEach((field) => {
            if (employee[field]) {
              decryptedEmployee[field] = decryptField(employee[field]);
            }
          });

          return decryptedEmployee;
        });

        setBarbers(decryptedData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchData();
  }, []);

  const filteredBarbers = useMemo(() => {
    if (selectedServices.length === 0) return [];

    return barbers.filter((barber) => {
      if (
        !Array.isArray(barber.arrayTypeWork) ||
        barber.clientType !== "employee"
      )
        return false;
      const selectedCategoryIds = selectedServices.map(
        (service) => service.category
      );
      return !barber.arrayTypeWork.some((id) =>
        selectedCategoryIds.includes(id)
      );
    });
  }, [barbers, selectedServices]);

  const getCategoryTextById = (id) => {
    const categoryId = Number(id);
    const category = categories.find((item) => item.id === categoryId);
    return category ? category.value : "Категория не найдена";
  };

  const categoryOptions = useMemo(() => {
    return categories.filter((item) => item.category === "Категория услуг");
  }, [categories]);

  const formattedDateTimeForServer = () => {
    if (!selectedTime) return null;
    const year = selectedTime.getFullYear();
    const month = String(selectedTime.getMonth() + 1).padStart(2, "0");
    const day = String(selectedTime.getDate()).padStart(2, "0");
    const hours = String(selectedTime.getHours()).padStart(2, "0");
    const minutes = String(selectedTime.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const enroll = async () => {
    setLoading(true);
    if (selectedServices.length === 0 || !selectedBarber || !selectedTime) {
      alert("Пожалуйста, выберите услуги, мастера и время.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify([
        {
          id_client_from: client.id,
          id_client_to: selectedBarber.id,
          id_service: selectedServices[0].id,
          number: "",
          status: 0,
          dateRecord: formattedDateTimeForServer(),
        },
      ])
    );

    try {
      const response = await fetch("https://api.salon-era.ru/records", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных на сервер");
      }
    } catch (error) {
      alert("Извините произошла ошибка!");
    } finally {
      setLoading(false);
      toggleClose();
    }
  };

  const toggleClose = useCallback(() => {
    setAddOrderModal(false);
    setSelectedTime(null);
    dispatch(clearServices());
    dispatch(clearBarber());
    document.body.style.overflow = "scroll";
  }, [setAddOrderModal, dispatch]);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.salon-era.ru/clients?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении клиента");
      closeMessageDeleteClients();
      setSuccesDelete(true);
      setClient(null);
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      setSuccesDelete(false);
      document.body.style.overflow = "scroll";
    }
  };

  const closeMessageDeleteClients = () => {
    setConfirmDeleteClient(false);
    setClientToDelete(null);
    document.body.style.overflow = "scroll";
  };

  const handleKeyDown = (e) => {
    const value = e.target.value;
    if (value === "+7" && e.key === "Backspace") {
      e.preventDefault();
      return;
    }
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
      return;
    }
    if (value.length >= 12 && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  return {
    loading,
    activeInput,
    setActiveInput,
    selectedTime,
    setSelectedTime,
    services,
    setServices,
    client,
    setClient,
    offerModal,
    setOfferModal,
    succesDelete,
    succesSignUp,
    setSuccesSignUp,
    clientToDelete,
    confirmDeleteClient,
    setClientToDelete,
    setConfirmDeleteClient,
    selectedCategory,
    setSelectedCategory,
    selectedBarber,
    selectedServices,
    filteredBarbers,
    categoryOptions,
    getCategoryTextById,
    enroll,
    toggleClose,
    handleDelete,
    closeMessageDeleteClients,
    handleKeyDown,
    setAddOrderModal,
  };
};
