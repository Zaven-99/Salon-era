import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import CustomButton from "../../customButton/CustomButton";
import CustomSelect from "../../customSelect/CustomSelect";
import styles from "./schedule.module.scss";
import Spinner from "../../spinner/Spinner";

const Schedule = () => {
  const { control, handleSubmit, reset, setValue } = useForm();
  const [employee, setEmployee] = useState([]); // Список сотрудников
  const [selectedCells, setSelectedCells] = useState({}); // Состояние для выбранных ячеек
  const [message, setMessage] = useState(false); // Для отображения модального окна
  const [selectedCell, setSelectedCell] = useState(null); // Для хранения выбранной ячейки
  const [currentDate, setCurrentDate] = useState(new Date()); // Текущая дата для переключения месяцев
  const [loading, setLoading] = useState(false); // Загрузка
  const [selectedDate, setSelectedDate] = useState([]);

  const tableRef = useRef(null); // Ссылка на таблицу для горизонтальной прокрутки

  // Функция для получения даты начала недели (понедельник)
  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Если воскресенье, сдвигаем на 6 дней назад
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    return startOfWeek;
  };

  // Функция для получения всех дней текущей недели
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
        displayDate: currentDay.toLocaleDateString("ru-RU"), // Форматируем дату для отображения
      });
    }
    return days;
  };

  const daysOfWeek = getDaysOfWeek(currentDate); // Получаем дни для текущей недели

  const generateWorkHours = () => {
    const hours = ["Выберите время"];
    const currentDate = new Date();
    currentDate.setHours(10, 0, 0, 0); // Начинаем с 10:00

    while (
      currentDate.getHours() < 20 ||
      (currentDate.getHours() === 20 && currentDate.getMinutes() === 0)
    ) {
      // Форматируем время в формате "HH:mm"
      const formattedTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24-часовой формат
      });
      hours.push(formattedTime);

      currentDate.setMinutes(currentDate.getMinutes() + 30); // Переходим к следующему времени через 30 минут
    }

    return hours;
  };

  const workHours = generateWorkHours(); // Список доступных часов

  // Функция для преобразования времени в нужный формат (YYYY-MM-DDTHH:mm)
  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleCellClick = (employeeIndex, dayIndex, employeeId, date) => {
    const cellKey = `${employeeId}-${dayIndex}`;
    const existingCellData = selectedCells[cellKey]; // Проверка, есть ли данные в ячейке

    setSelectedCell({ employeeIndex, dayIndex, employeeId });
    setSelectedDate(date);

    // Если данные уже есть в ячейке, заполняем форму этими данными
    if (existingCellData) {
      setValue("workTimeFrom", existingCellData.startTime.slice(-5)); // Устанавливаем время начала
      setValue("workTimeTo", existingCellData.endTime.slice(-5)); // Устанавливаем время окончания
    } else {
      reset(); // Если данных нет, сбрасываем форму
    }

    setMessage(true); // Показываем модальное окно
  };

  const closeMessage = () => {
    setMessage(false);
    setSelectedCell(null);
    reset(); // Сброс формы
  };

  // Функция для отправки формы
  const onSubmit = async (formValues) => {
    setLoading(true);

    // Преобразуем выбранную дату в объект Date
    const startDateTime = new Date(selectedDate); // В selectedDate будет выбранная дата в формате 'YYYY-MM-DD'

    // Устанавливаем время начала
    const [startHour, startMinute] = formValues.workTimeFrom.split(":");
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(selectedDate); // Используем ту же выбранную дату для времени окончания
    const [endHour, endMinute] = formValues.workTimeTo.split(":");
    endDateTime.setHours(endHour, endMinute, 0, 0);

    // Преобразуем выбранную дату и время в формат 'YYYY-MM-DDTHH:mm'
    const formattedStartTime = formatDateTime(startDateTime);
    const formattedEndTime = formatDateTime(endDateTime);

    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify({
        idClient: selectedCell.employeeId,
        scheludeDateStart: formattedStartTime,
        scheludeDateEnd: formattedEndTime,
      })
    );

    try {
      const response = await fetch("https://api.salon-era.ru/clientsschelude", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Ошибка при отправке данных");
      }

      // Обновляем состояние с новыми данными
      setSelectedCells((prev) => ({
        ...prev,
        [`${formValues.employeeIndex}-${formValues.dayIndex}`]: {
          clientId: formValues.clientId,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
        },
      }));

      closeMessage();
      reset(); // Сброс формы
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
    } finally {
      setLoading(false);
    }
  };

  // Функция для переключения на следующую неделю
  const nextWeek = () => {
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeekDate);

    setSelectedCells({});
  };

  // Функция для переключения на предыдущую неделю
  const prevWeek = () => {
    const prevWeekDate = new Date(currentDate);
    prevWeekDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeekDate);

    setSelectedCells({});
  };

  // Загрузка данных сотрудников
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

  // Загрузка расписания клиентов
  const fetchClientSchedule = async () => {
    try {
      const response = await fetch(
        "https://api.salon-era.ru/clientsschelude/all",
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`Ошибка http! статус: ${response.status}`);
      }
      const data = await response.json();

      // Обновляем состояние расписания
      const updatedCells = {};

      data.forEach((scheduleItem) => {
        const { idClient, scheludeDateStart, scheludeDateEnd } = scheduleItem;

        // Находим соответствующий день и сотрудника
        const dateStart = new Date(scheludeDateStart);
        const dayIndex = daysOfWeek.findIndex((day) => {
          const dayDate = new Date(day.date);
          return dayDate.toDateString() === dateStart.toDateString();
        });

        if (dayIndex !== -1) {
          updatedCells[`${idClient}-${dayIndex}`] = {
            startTime: scheludeDateStart,
            endTime: scheludeDateEnd,
          };
        }
      });

      setSelectedCells(updatedCells); // Обновляем состояние с расписанием
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchClientSchedule();
  }, [selectedCell, currentDate]);

  const formatTimeToDisplay = (str) => {
    return str.slice(-5);
  };

  const currentMonth = currentDate.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });

  const handleDelete = async (employeeId, dayIndex) => {
    setLoading(true);

    const cellKey = `${employeeId}-${dayIndex}`;

    try {
      // Выполняем запрос для удаления расписания
      const response = await fetch(
        `https://api.salon-era.ru/clientsschelude?id=${employeeId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Ошибка при удалении записи");

      // Убираем данные из состояния после удаления
      setSelectedCells((prevCells) => {
        const newCells = { ...prevCells };
        delete newCells[cellKey]; // Удаляем конкретную ячейку
        return newCells;
      });

      closeMessage(); // Закрываем модальное окно
    } catch (error) {
      console.error("Ошибка при удалении записи:", error);
    } finally {
      setLoading(false);
    }
  };

  // Если идет загрузка
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.schedule}>
      <div className={styles["week-navigation"]}>
        <button onClick={prevWeek} className={styles["nav-button"]}>
          Предыдущая неделя
        </button>
        <span className={styles["week-span"]}>
          {`Неделя с ${daysOfWeek[0].displayDate} по ${daysOfWeek[6].displayDate}`}
        </span>
        <button onClick={nextWeek} className={styles["nav-button"]}>
          Следующая неделя
        </button>
      </div>

      <div className={styles.table} ref={tableRef}>
        <span>{currentMonth}</span>
        <table>
          <thead>
            <tr>
              <th>Имя Фамилия</th>
              {daysOfWeek.map((dayObj, index) => (
                <th key={index}>
                  {dayObj.weekday} <br /> {dayObj.displayDate}
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
                {daysOfWeek.map((dayObj, dayIndex) => {
                  const cellKey = `${item.id}-${dayIndex}`;
                  const cellData = selectedCells[cellKey];

                  return (
                    <td
                      key={dayIndex}
                      className={cellData ? styles.red : ""}
                      onClick={() =>
                        handleCellClick(index, dayIndex, item.id, dayObj.date)
                      }
                    >
                      {cellData
                        ? `${formatTimeToDisplay(
                            cellData.startTime
                          )} - ${formatTimeToDisplay(cellData.endTime)}`
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
            <h2 className={styles["modal-title"]}>
              Выбрать ячейку для {selectedDate}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles["work-time-block"]}>
                <label className={styles["label"]}>
                  Введите время начала работы:
                </label>
                <Controller
                  name="workTimeFrom"
                  control={control}
                  rules={{ required: "Это поле обязательно" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      control={control}
                      name="workTimeFrom"
                      map={workHours}
                    />
                  )}
                />
              </div>
              <div className={styles["work-time-block"]}>
                <label className={styles["label"]}>
                  Введите время окончания работы:
                </label>
                <Controller
                  name="workTimeTo"
                  control={control}
                  rules={{ required: "Это поле обязательно" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      control={control}
                      name="workTimeTo"
                      map={workHours}
                    />
                  )}
                />
              </div>
              <div className={styles["btn-block"]}>
                <CustomButton label="Да" className={styles.yes} type="submit" />
                <CustomButton
                  className={styles.no}
                  label="Нет"
                  onClick={closeMessage}
                />
                {selectedCell &&
                  selectedCells[
                    `${selectedCell.employeeId}-${selectedCell.dayIndex}`
                  ] && (
                    <CustomButton
                      className={styles.delete}
                      label="Удалить"
                      onClick={() =>
                        handleDelete(
                          selectedCell.employeeId,
                          selectedCell.dayIndex
                        )
                      }
                    />
                  )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
