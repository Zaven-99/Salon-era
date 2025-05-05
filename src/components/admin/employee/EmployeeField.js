import React from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../../customButton/CustomButton";
import EmployeeList from "./employeeList/EmployeeList";
import Modal from "../../modal/Modal";
import { EmployeeFieldState } from "../../hooks/employee/EmployeeFieldState";
import AddEmployee from "./addEmployee/AddEmployee";

import styles from "./employeeField.module.scss";

const EmployeeField = () => {
  useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      login: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      position: "1",
      dateWorkIn: "",
      gender: "",
      imageLink: "",
      clientType: "employee",
    },
  });

  const {
    showHelpModal,
    addEmployee,
    loading,
    employee,
    positions,
    toggleHelpModal,
    handleKeyDown,
    toggleOpen,
    toggleClose,
    setEmployee,
    setLoading,
    getPositionTextById,
  } = EmployeeFieldState();

  return (
    <div className={styles["employee-field"]}>
      <CustomButton
        className={styles["b-btn"]}
        label="Добавить сотрудника"
        onClick={toggleOpen}
      />
      {addEmployee && (
        <Modal toggleOpen={toggleOpen} toggleClose={toggleClose}>
          <h2>Добавить сотрудника</h2>
          <AddEmployee
            setLoading={setLoading}
            setEmployee={setEmployee}
            toggleClose={toggleClose}
            toggleHelpModal={toggleHelpModal}
            showHelpModal={showHelpModal}
            handleKeyDown={handleKeyDown}
            positions={positions}
            loading={loading}
          />
        </Modal>
      )}

      <EmployeeList
        employee={employee}
        setEmployee={setEmployee}
        loading={loading}
        setLoading={setLoading}
        toggleHelpModal={toggleHelpModal}
        showHelpModal={showHelpModal}
        toggleOpen={toggleOpen}
        toggleClose={toggleClose}
        handleKeyDown={handleKeyDown}
        positions={positions}
        getPositionTextById={getPositionTextById}
      />
    </div>
  );
};

export default EmployeeField;
