import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../use-auth/use-auth";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearServices } from "../../../../store/slices/serviceSlice";
import { clearBarber } from "../../../../store/slices/barberSlice";
import CustomButton from "../../../customButton/CustomButton";
import Spinner from "../../../spinner/Spinner";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import styles from "./chooseDate.module.scss";

const ChooseDate = () => {
  const { id: clientId } = useAuth();
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    }

    const selectedService = selectedServices[0];

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        id_client_from: clientId,
        id_client_to: selectedBarber.id,
        id_service: selectedService.id,
        number: "",
        status: 0,
        dateRecord: formattedDateTimeForServer(),
      })
    );

    try {
      const response = await fetch("https://api.salon-era.ru/records", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных на сервер");
      }

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

  if (date < today) {
    return (
      <div className={styles["choose-date"]}>
        <h1 className={styles.signUpForAHaircut}>Записаться</h1>

        <div className={styles["calendar-container"]}>
          <div>
            <div className={styles["btn-block"]}>
              <p
                onClick={() => navigate("/select-barbers")}
                className={styles.toMain}
              >
                назад
              </p>
              <p onClick={() => navigate("/")} className={styles.toMain}>
                На главную
              </p>
            </div>
            <p className={styles.dataSelected}>
              Нельзя записаться на прошедшую дату.
            </p>
            <Calendar
              onChange={handleDateChange}
              value={date}
              className={styles.calendar}
            />
          </div>
        </div>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className={styles["modal-overlay"]}>
        <div className={styles["modal-content"]}>
          <p className={styles["date-sign__up"]}>
            Вы записались на {selectedTime.toLocaleString()}
          </p>
          <CustomButton
            className={styles["accept"]}
            onClick={handleOkClick}
            label="Принять"
            type="button"
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["choose-date"]}>
      <h1 className={styles.signUpForAHaircut}>Записаться</h1>
      <div className={styles["calendar-container"]}>
        <div>
          <div className={styles["btn-block"]}>
            <p
              onClick={() => navigate("/select-barbers")}
              className={styles.toMain}
            >
              назад
            </p>
            <p onClick={() => navigate("/")} className={styles.toMain}>
              На главную
            </p>
          </div>
          <p className={styles.dataSelected}>
            Выбранная дата: {date.toLocaleDateString()}
          </p>
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
                        selectedTime.toISOString() ===
                          new Date(slot).toISOString()
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

          <CustomButton
            onClick={handleSubmit}
            label="Записаться"
            type="button"
            disabled={!selectedTime}
            className={styles["sign-up_to__haircut"]}
          />
        </div>
      </div>
    </div>
  );
};

export default ChooseDate;
