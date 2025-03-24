import React from 'react';

import styles from './table.module.scss'

const Table = ({
  setSelectedCell,
  setSelectedDate,
  setValue,
  reset,
  setMessage,
  selectedCells,
  daysOfWeek,
  employee,
}) => {
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

  const formatTimeToDisplay = (str) => {
    return str.slice(-5);
  };
  return (
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
  );
};

export default Table;