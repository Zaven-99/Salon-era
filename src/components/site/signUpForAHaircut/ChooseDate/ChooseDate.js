import React from "react";
import CustomButton from "../../../customButton/CustomButton";
import Spinner from "../../../spinner/Spinner";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChooseDateState } from "../../../hooks/signUpForHaircut/ChooseDateState";
import styles from "./chooseDate.module.scss";

const ChooseDate = () => {
  const {
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
    navigate,
  } = ChooseDateState();

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
