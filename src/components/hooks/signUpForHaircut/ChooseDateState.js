import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearServices } from "../../../store/slices/serviceSlice";
import { clearBarber } from "../../../store/slices/barberSlice";
import { useAuth } from "../../../use-auth/use-auth";

export const ChooseDateState = () => {
  const { id: clientId } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );
  const selectedBarber = useSelector((state) => state.barber.selectedBarber);

  const handleDateChange = (newDate) => {
    const resetTime = new Date(newDate);
    resetTime.setHours(0, 0, 0, 0);
    setDate(resetTime);
    setSelectedTime(null);
    setErrorMessage("");
  };

  const fetchDate = async (selectedDate) => {
    setLoading(true);
    if (!selectedBarber) return;

    const sumDuration = selectedServices.reduce(
      (total, service) => total + service.duration,
      0
    );

    try {
      const response = await fetch(
        `https://api.salon-era.ru/employees/timeslot/${selectedBarber.id}/${sumDuration}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok)
        throw new Error("Ошибка при получении свободных слотов");

      const data = await response.json();

      const filteredSlots = data.filter((slot) => {
        const slotDate = new Date(slot);
        const now = new Date();
        return (
          slotDate >= now &&
          slotDate.getFullYear() === selectedDate.getFullYear() &&
          slotDate.getMonth() === selectedDate.getMonth() &&
          slotDate.getDate() === selectedDate.getDate()
        );
      });

      if (sumDuration > filteredSlots.length) {
        setErrorMessage("Сегодня записаться на эту услугу невозможно");
        setAvailableSlots([]);
      } else {
        setErrorMessage("");
        setAvailableSlots(filteredSlots);
      }
    } catch (error) {
      alert(`Произошла ошибка при получении данных. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDate(date);
  }, [date]);

  const handleTimeSelect = (slot) => {
    const selectedDate = new Date(slot);
    const fullDate = new Date(date);
    selectedDate.setFullYear(fullDate.getFullYear());
    selectedDate.setMonth(fullDate.getMonth());
    selectedDate.setDate(fullDate.getDate());
    setSelectedTime(selectedDate);
  };

  const formattedDateTimeForServer = () => {
    if (!selectedTime) return null;
    const year = selectedTime.getFullYear();
    const month = String(selectedTime.getMonth() + 1).padStart(2, "0");
    const day = String(selectedTime.getDate()).padStart(2, "0");
    const hours = String(selectedTime.getHours()).padStart(2, "0");
    const minutes = String(selectedTime.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (selectedServices.length === 0 || !selectedBarber || !selectedTime) {
      alert("Пожалуйста, выберите услуги, мастера и время.");
      setLoading(false);
      return;
    }

    const selectedService = selectedServices[0];

    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify([
        {
          id_client_from: clientId,
          id_employee_to: selectedBarber.id,
          id_service: selectedService.id,
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

      if (!response.ok) throw new Error("Ошибка при отправке данных на сервер");

      setSuccessMessage(true);
    } catch (error) {
      alert("Извините произошла ошибка!");
    } finally {
      setLoading(false);
    }
  };

  const handleOkClick = () => {
    dispatch(clearServices());
    dispatch(clearBarber());
    navigate("/");
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    date,
    selectedTime,
    successMessage,
    availableSlots,
    loading,
    errorMessage,
    today,
    handleDateChange,
    handleTimeSelect,
    handleSubmit,
    handleOkClick,
    setDate,
    navigate,
  };
};
