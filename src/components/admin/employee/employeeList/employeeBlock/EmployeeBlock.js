import React from "react";

import styles from "./employeeBlock.module.scss";

const EmployeeBlock = ({ employee, formatDate, getGenderText }) => {
  return (
    <div className={styles["employee-item"]}>
      <div className={styles["employee-item__inner"]}>
        <strong>Имя:</strong>
        <div>{employee.firstName}</div>
      </div>
      <div className={styles["employee-item__inner"]}>
        <strong>Фамилия:</strong>
        <div>{employee.lastName}</div>
      </div>
      <div className={styles["employee-item__inner"]}>
        <strong>Логин:</strong> <div>{employee.login}</div>
      </div>

      <div className={styles["employee-item__inner"]}>
        <strong>Email:</strong> <div>{employee.email}</div>
      </div>
      <div className={styles["employee-item__inner"]}>
        <strong>Телефон:</strong> <div>{employee.phone}</div>
      </div>
      <div className={styles["employee-item__inner"]}>
        <strong>Дата:</strong>
        <div>{formatDate(employee.dateWorkIn)}</div>
      </div>

      <div className={styles["employee-item__inner"]}>
        <strong>Пол:</strong> <div>{getGenderText(employee.gender)}</div>
      </div>
    </div>
  );
};

export default EmployeeBlock;
