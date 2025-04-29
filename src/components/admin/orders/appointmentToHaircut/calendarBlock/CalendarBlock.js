import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";

import styles from "./calendarBlock.module.scss";
import Spinner from "../../../../spinner/Spinner";

const CalendarBlock = ({
  setSelectedTime,
  selectedBarber,
  selectedTime,
  selectedServices,
}) => {
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDate = async (selectedDate) => {
    setLoading(true);
    if (!selectedBarber) return;

    const sumDuration = selectedServices.reduce(
      (total, service) => total + service.duration,
      0
    );

    try {
      const response = await fetch(
        `https://api.salon-era.ru/clients/timeslot/${selectedBarber.id}/${sumDuration}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении свободных слотов");
      }

      const data = await response.json();

      let filteredSlots = data.filter((slot) => {
        const slotDate = new Date(slot);

        const currentDate = new Date();
        if (slotDate < currentDate) {
          return false;
        }

        return (
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

  const handleDateChange = (newDate) => {
    const resetTime = new Date(newDate);
    resetTime.setHours(0, 0, 0, 0);
    setDate(resetTime);
    setSelectedTime(null);
    setErrorMessage("");
  };

  const handleTimeSelect = (slot) => {
    const selectedDate = new Date(slot);
    const fullDate = new Date(date);
    selectedDate.setFullYear(fullDate.getFullYear());
    selectedDate.setMonth(fullDate.getMonth());
    selectedDate.setDate(fullDate.getDate());
    setSelectedTime(selectedDate);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={date}
        className={styles.calendar}
      />

      {errorMessage ? (
        <p className={styles["error-message"]}>{errorMessage}</p>
      ) : (
        <>
          <h2>Доступные слоты:</h2>
          <ul className={styles["slots-block"]}>
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <li
                  key={index}
                  onClick={() => handleTimeSelect(slot)}
                  className={
                    selectedTime &&
                    selectedTime.toISOString() === new Date(slot).toISOString()
                      ? styles.selected
                      : styles.select
                  }
                >
                  {new Date(slot).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </li>
              ))
            ) : (
              <li className={styles["empty-slots"]}>
                Нет доступных слотов на эту дату
              </li>
            )}
          </ul>
        </>
      )}

      {selectedTime && (
        <p className={styles.dataSelected}>
          Выбранное время:
          {selectedTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
};

export default CalendarBlock;
