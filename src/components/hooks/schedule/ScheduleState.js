import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";

export const ScheduleState = () => {
  const { control, handleSubmit, reset, setValue } = useForm();
  const [employee, setEmployee] = useState([]);
  const [selectedCells, setSelectedCells] = useState({});
  const [message, setMessage] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState([]);
  const [day, setDay] = useState([]);
  const tableRef = useRef(null);

  const toggleOpen = () => setMessage(true);
  const toggleClose = () => setMessage(false);

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    return startOfWeek;
  };

  const getDaysOfWeek = (date) => {
    const startOfWeek = getStartOfWeek(date);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push({
        date: `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${currentDay
          .getDate()
          .toString()
          .padStart(2, "0")}`,
        weekday: currentDay.toLocaleDateString("ru-RU", { weekday: "short" }),
        displayDate: currentDay.toLocaleDateString("ru-RU"),
      });
    }
    return days;
  };

  const generateWorkHours = () => {
    const hours = ["Выберите время"];
    const currentDate = new Date();
    currentDate.setHours(10, 0, 0, 0);

    while (
      currentDate.getHours() < 20 ||
      (currentDate.getHours() === 20 && currentDate.getMinutes() === 0)
    ) {
      hours.push(
        currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    return hours;
  };

  const workHours = generateWorkHours();

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const closeMessage = () => {
    setMessage(false);
    setSelectedCell(null);
    reset();
  };

  const onSubmit = async (formValues) => {
    setLoading(true);
    const startDateTime = new Date(selectedDate);
    const [startHour, startMinute] = formValues.workTimeFrom.split(":");
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(selectedDate);
    const [endHour, endMinute] = formValues.workTimeTo.split(":");
    endDateTime.setHours(endHour, endMinute, 0, 0);

    const formattedStartTime = formatDateTime(startDateTime);
    const formattedEndTime = formatDateTime(endDateTime);

    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify([
        {
          idEmployee: selectedCell.employeeId,
          scheludeDateStart: formattedStartTime,
          scheludeDateEnd: formattedEndTime,
        },
      ])
    );

    try {
      const response = await fetch("https://api.salon-era.ru/clientsschelude", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error(await response.text());

      setSelectedCells((prev) => ({
        ...prev,
        [`${formValues.employeeIndex}-${formValues.dayIndex}`]: {
          idEmployee: formValues.idEmployee,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
        },
      }));

      closeMessage();
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextWeek = () => {
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeekDate);
    setSelectedCells({});
  };

  const prevWeek = () => {
    const prevWeekDate = new Date(currentDate);
    prevWeekDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeekDate);
    setSelectedCells({});
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

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/employees/all");
      if (!response.ok)
        throw new Error(`Ошибка http! статус: ${response.status}`);
      const data = await response.json();

      const decryptedData = data.map((employee) => {
        const fieldsToDecrypt = ["lastName", "firstName"];
        const decryptedEmployee = { ...employee };

        fieldsToDecrypt.forEach((field) => {
          if (employee[field]) {
            decryptedEmployee[field] = decryptField(employee[field]);
          }
        });

        return decryptedEmployee;
      });
      setEmployee(decryptedData.filter((e) => e.login !== "admin"));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientSchedule = async () => {
    try {
      const response = await fetch(
        "https://api.salon-era.ru/clientsschelude/all"
      );
      if (!response.ok)
        throw new Error(`Ошибка http! статус: ${response.status}`);
      const data = await response.json();
       
      const updatedCells = {};
      data.forEach((item) => {
        const dateStart = new Date(item.scheludeDateStart);
        const dayIndex = getDaysOfWeek(currentDate).findIndex((day) => {
          return new Date(day.date).toDateString() === dateStart.toDateString();
        });

        if (dayIndex !== -1) {
          updatedCells[`${item.idEmployee}-${dayIndex}`] = {
            idEmployee: item.id,
            startTime: item.scheludeDateStart,
            endTime: item.scheludeDateEnd,
          };
        }

        setDay(item);
      });

      setSelectedCells(updatedCells);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    fetchClientSchedule();
  }, [selectedCell, currentDate]);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.salon-era.ru/clientsschelude?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Ошибка при удалении записи");

      setSelectedCells((prev) => {
        const updated = { ...prev };
        const keyToDelete = Object.keys(updated).find(
          (key) => updated[key]?.idEmployee === id
        );
        if (keyToDelete) delete updated[keyToDelete];
        return updated;
      });

      closeMessage();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    control,
    handleSubmit,
    reset,
    setValue,
    employee,
    selectedCells,
    setSelectedCells,
    message,
    setMessage,
    selectedCell,
    setSelectedCell,
    currentDate,
    setCurrentDate,
    loading,
    selectedDate,
    setSelectedDate,
    day,
    tableRef,
    workHours,
    toggleOpen,
    toggleClose,
    closeMessage,
    onSubmit,
    nextWeek,
    prevWeek,
    getDaysOfWeek,
    currentMonth: currentDate.toLocaleDateString("ru-RU", {
      month: "long",
      year: "numeric",
    }),
    handleDelete,
  };
};
