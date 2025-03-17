import React, { useState, useEffect } from "react";
import styles from "./schedule.module.scss";
import CustomButton from "../../customButton/CustomButton";

const Schedule = () => {
  const [employee, setEmployee] = useState([]);
  const [selectedCells, setSelectedCells] = useState({});
  const [message, setMessage] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null); // Для хранения выбранной ячейки
  const [workTimeFrom, setWorkTimeFrom] = useState(""); // Время начала работы для выбранной ячейки
  const [workTimeTo, setWorkTimeTo] = useState(""); // Время окончания работы для выбранной ячейки
  const [currentDate, setCurrentDate] = useState(new Date()); // Текущая дата для переключения месяцев

  const fetchEmployee = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/clients/all");
      if (!response.ok) {
        throw new Error(`Ошибка http! статус: ${response.status}`);
      }

      const data = await response.json();
      const filteredEmployee = data.filter(
        (employee) => employee.clientType === "employee"
      );
      setEmployee(filteredEmployee);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  // Генерация всех дней для выбранного месяца
  const getDaysOfMonth = (date) => {
    const days = [];
    const currentMonth = date.getMonth(); // Месяц из текущей даты
    const currentYear = date.getFullYear(); // Год из текущей даты

    // Получаем первый день месяца
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0); // Последний день месяца

    // Генерация дней месяца
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(currentYear, currentMonth, i);
      days.push({
        date: `${i < 10 ? "0" : ""}${i}-${currentMonth + 1 < 10 ? "0" : ""}${
          currentMonth + 1
        }-${currentYear}`, // Форматируем дату
        weekday: currentDate.toLocaleDateString("ru-RU", { weekday: "short" }), // Добавляем день недели
      });
    }

    return days;
  };

  const daysOfMonth = getDaysOfMonth(currentDate);

  const handleCellClick = (employeeIndex, dayIndex) => {
    setSelectedCell({ employeeIndex, dayIndex }); // Сохраняем выбранную ячейку
    setMessage(true); // Показываем модальное окно
  };

  const closeMessage = () => {
    setMessage(false);
    setSelectedCell(null); // Закрыть модальное окно и сбросить выбранную ячейку
    setWorkTimeFrom(""); // Очистить время начала
    setWorkTimeTo(""); // Очистить время окончания
  };

  const handleConfirmClick = () => {
    if (selectedCell && workTimeFrom && workTimeTo) {
      const { employeeIndex, dayIndex } = selectedCell;
      const key = `${employeeIndex}-${dayIndex}`;
      const clientId = employee[employeeIndex].id; // Получаем ID клиента
      const date = daysOfMonth[dayIndex].date; // Получаем дату

      // Преобразуем время начала и окончания в нужный формат для сервера
      const [hoursFrom, minutesFrom] = workTimeFrom.split(":");
      const [hoursTo, minutesTo] = workTimeTo.split(":");

      // Используем актуальную дату для сохранения времени
      const currentDate = new Date();
      currentDate.setHours(hoursFrom, minutesFrom, 0); // Устанавливаем время начала
      const formattedStartDate = currentDate.toISOString(); // Получаем ISO формат

      currentDate.setHours(hoursTo, minutesTo, 0); // Устанавливаем время окончания
      const formattedEndDate = currentDate.toISOString(); // Получаем ISO формат

      // Обновляем состояние с данными только для id, startTime и endTime
      setSelectedCells((prev) => {
        const updatedCells = { ...prev };
        if (updatedCells[key]) {
          delete updatedCells[key]; // Убираем цвет, если ячейка уже выбрана
        } else {
          updatedCells[key] = {
            clientId,
            startTime: formattedStartDate,
            endTime: formattedEndDate,
          };
        }
        return updatedCells;
      });
      closeMessage(); // Закрыть модальное окно после подтверждения
    } else {
      alert("Пожалуйста, укажите время начала и окончания!");
    }
  };

  const handleWorkTimeFromChange = (event) => {
    setWorkTimeFrom(event.target.value); // Обновляем время начала
  };

  const handleWorkTimeToChange = (event) => {
    setWorkTimeTo(event.target.value); // Обновляем время окончания
  };

  // Генерация времени для выпадающего списка
  const generateWorkHours = () => {
    const hours = [];
    for (let i = 10; i <= 20; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i < 10 ? `0${i}` : i;
        const minute = j === 0 ? "00" : "30";
        hours.push(`${hour}:${minute}`);
      }
    }
    return hours;
  };

  const workHours = generateWorkHours();

  // Функция для переключения на следующий месяц
  const nextMonth = () => {
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextMonthDate);
  };

  // Функция для переключения на предыдущий месяц
  const prevMonth = () => {
    const prevMonthDate = new Date(currentDate);
    prevMonthDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prevMonthDate);
  };

  console.log(selectedCells);

  return (
    <div className={styles.schedule}>
      <div className={styles["month-navigation"]}>
        <button onClick={prevMonth} className={styles["nav-button"]}>
          Предыдущий месяц
        </button>
        <span className={styles["month-span"]}>
          {currentDate.toLocaleDateString("ru-RU", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button onClick={nextMonth} className={styles["nav-button"]}>
          Следующий месяц
        </button>
      </div>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Имя Фамилия</th>
              {daysOfMonth.map((dayObj, index) => (
                <th key={index}>
                  {dayObj.weekday} <br /> {dayObj.date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employee.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.firstName} {item.lastName}
                </td>
                {daysOfMonth.map((_, dayIndex) => {
                  const cellKey = `${index}-${dayIndex}`;
                  const cellData = selectedCells[cellKey];
                  return (
                    <td
                      key={dayIndex}
                      className={cellData ? styles.red : ""}
                      onClick={() => handleCellClick(index, dayIndex)} // Обработка клика
                    >
                      {cellData
                        ? `${new Date(cellData.startTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )} - ${new Date(cellData.endTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}`
                        : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message && selectedCell && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <h2 className={styles["modal-title"]}>Выбрать ячейку?</h2>
            <div className={styles["work-time-block"]}>
              <label className={styles["label"]}>
                Введите время начала работы:
              </label>
              <select
                value={workTimeFrom}
                onChange={handleWorkTimeFromChange}
                className={styles["select"]}
              >
                <option value="">Выберите время</option>
                {workHours.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["work-time-block"]}>
              <label className={styles["label"]}>
                Введите время окончания работы:
              </label>
              <select
                value={workTimeTo}
                onChange={handleWorkTimeToChange}
                className={styles["select"]}
              >
                <option value="">Выберите время</option>
                {workHours.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["btn-block"]}>
              <CustomButton
                label="Да"
                className={styles.yes}
                onClick={handleConfirmClick} // Обработчик подтверждения
              />
              <CustomButton
                className={styles.no}
                label="Нет"
                onClick={closeMessage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
