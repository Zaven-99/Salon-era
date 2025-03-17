import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../../customButton/CustomButton";
import EmployeeList from "./employeeList/EmployeeList";
import Modal from "../../modal/Modal";
import Spinner from "../../spinner/Spinner";

import styles from "./employeeField.module.scss";
import AddEmployee from "./addEmployee/AddEmployee";

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

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [addEmployee, setAddEmployee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  const handleKeyDown = (e) => {
    const value = e.target.value;

    if (value === "+7" && e.key === "Backspace") {
      e.preventDefault();
      return;
    }

    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
      return;
    }

    if (value.length >= 12 && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const toggleOpen = () => {
    setAddEmployee(true);
    document.body.style.overflow = "hidden";
  };
  const toggleClose = () => {
    setAddEmployee(false);
    document.body.style.overflow = "scroll";
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["employee-field"]}>
      <CustomButton
        className={styles["add-employee"]}
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
      />
    </div>
  );
};

export default EmployeeField;
