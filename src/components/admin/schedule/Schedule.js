import React from "react";
import { Controller } from "react-hook-form";
import CustomButton from "../../customButton/CustomButton";
import CustomSelect from "../../customSelect/CustomSelect";
import Spinner from "../../spinner/Spinner";
import BtnBlock from "../../btnBlock/BtnBlock";
import Modal from "../../modal/Modal";
import { ScheduleState } from "../../hooks/schedule/ScheduleState";
import styles from "./schedule.module.scss";
import Table from "./table/Table";

const Schedule = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    employee,
    selectedCells,
    setSelectedCell,
    selectedCell,
    message,
    toggleOpen,
    toggleClose,
    closeMessage,
    onSubmit,
    nextWeek,
    prevWeek,
    selectedDate,
    setSelectedDate,
    workHours,
    tableRef,
    getDaysOfWeek,
    currentDate,
    currentMonth,
    handleDelete,
    day,
    setMessage,
    loading,
  } = ScheduleState();

  const daysOfWeek = getDaysOfWeek(currentDate);

  // Если идет загрузка
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.schedule}>
      <div className={styles["week-navigation"]}>
        <BtnBlock
          className1={styles["nav-button"]}
          className2={styles["nav-button"]}
          className4={styles["week-navigation"]}
          label1="Предыдущая неделя"
          label2="Следующая неделя"
          fnc1={prevWeek}
          fnc2={nextWeek}
          Children={`Неделя с ${daysOfWeek[0].displayDate} по ${daysOfWeek[6].displayDate}`}
        ></BtnBlock>
      </div>

      <div className={styles.table} ref={tableRef}>
        <span className={styles.month}>{currentMonth}</span>
        <Table
          setSelectedDate={setSelectedDate}
          setValue={setValue}
          employee={employee}
          setSelectedCell={setSelectedCell}
          reset={reset}
          setMessage={setMessage}
          selectedCells={selectedCells}
          daysOfWeek={daysOfWeek}
        />
      </div>

      {message && selectedCell && (
        <Modal toggleOpen={toggleOpen} toggleClose={toggleClose}>
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
                    valueType="item"
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
                    valueType="item"
                  />
                )}
              />
            </div>
            <div className={styles["btn-block"]}>
              <CustomButton label="Да" className={styles["g-btn"]} />
              <CustomButton
                className={styles["r-btn"]}
                label="Нет"
                onClick={closeMessage}
              />
              {selectedCell &&
                selectedCells[
                  `${selectedCell.employeeId}-${selectedCell.dayIndex}`
                ] && (
                  <CustomButton
                    className={styles["r-btn"]}
                    label="Удалить"
                    onClick={() => handleDelete(day.id)}
                  />
                )}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Schedule;
