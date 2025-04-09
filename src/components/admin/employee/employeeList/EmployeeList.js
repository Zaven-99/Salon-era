import React, { useState, useEffect } from "react";

import Modal from "../../../modal/Modal";
import Spinner from "../../../spinner/Spinner";

import styles from "./employeeList.module.scss";
import avatarImg from "../../../../img/icons/avatar.png";
import BtnBlock from "../../../btnBlock/BtnBlock";
import EditModal from "./editModal/EditModal";
import EmployeeBlock from "./employeeBlock/EmployeeBlock";

const EmployeeList = ({
  employee,
  setEmployee,
  toggleHelpModal,
  showHelpModal,
  toggleOpen,
  toggleClose,
  handleKeyDown,
  positionOptions,
  getPositionTextById,
}) => {
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({});
  const [confirmDeleteEmployee, setConfirmDeleteEmployee] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const genderMap = { 0: "Женщина", 1: "Мужчина" };

  const getGenderText = (gender) => genderMap[gender];

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/clients/all");

      if (!response.ok) throw new Error("Ошибка при получении сотрудников");
      const data = await response.json();

      const filteredData = data.filter(
        (employee) => employee.clientType === "employee"
      );

      // Удаляем дубликаты по id
      const uniqueData = Array.from(
        new Map(filteredData.map((item) => [item.id, item])).values()
      );

      setEmployee(uniqueData);
    } catch (error) {
      console.error("Ошибка при загрузке сотрудников");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchEmployee();
    })();
  }, []);

  const handleDelete = async (id) => {
    if (employeeToDelete === null) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.salon-era.ru/clients?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении сотрудника");
      setEmployee((prevEmployee) =>
        prevEmployee.filter((employee) => employee.id !== id)
      );
      closeMessageDeleteEmployee();
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
    }
  };
  const handleEdit = (employee) => {
    setEmployeeId(employee.id);
    setEditedEmployee(employee);
  };

  const groupedEmployee = employee.reduce((acc, employee) => {
    const { position } = employee;
    if (!acc[position]) acc[position] = [];
    acc[position].push(employee);
    return acc;
  }, {});

  if (!Object.keys(groupedEmployee).length) {
    return <p className={styles.message}>Список сотрудников пуст.</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
    };
    return date.toLocaleString("ru-RU", options);
  };

  const showMessageDeleteEmployee = (id) => {
    setEmployeeToDelete(id);
    setConfirmDeleteEmployee(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteEmployee = () => {
    setConfirmDeleteEmployee(false);
    setEmployeeToDelete(null);
    document.body.style.overflow = "scroll";
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["employee-list"]}>
      <h1 className={styles.employee}>Сотрудники</h1>

      {Object.keys(groupedEmployee).map((position) => (
        <div key={position}>
          <h4 className={styles.category}>{getPositionTextById(position)}</h4>

          <ul className={styles["employee-list__inner"]}>
            {groupedEmployee[position].map((employee, index) => (
              <li className={styles["employee-item"]} key={index}>
                {employeeId === employee.id ? (
                  <Modal
                    toggleOpen={toggleOpen}
                    toggleClose={toggleClose}
                    setEmployeeId={setEmployeeId}
                  >
                    <EditModal
                      imagePreview={imagePreview}
                      setLoading={setLoading}
                      editedEmployee={editedEmployee}
                      setEmployee={setEmployee}
                      setEmployeeId={setEmployeeId}
                      setEditedEmployee={setEditedEmployee}
                      setImagePreview={setImagePreview}
                      toggleHelpModal={toggleHelpModal}
                      showHelpModal={showHelpModal}
                      handleKeyDown={handleKeyDown}
                      positionOptions={positionOptions}
                      employee={employee}
                    />
                  </Modal>
                ) : (
                  <>
                    <div className={styles["employee-item__inner"]}>
                      {employee.imageLink ? (
                        <img
                          className={styles["image-employee"]}
                          src={employee.imageLink}
                          alt=""
                        />
                      ) : (
                        <div>
                          <img
                            className={styles["image-employee"]}
                            src={avatarImg}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                    <EmployeeBlock
                      employee={employee}
                      formatDate={formatDate}
                      getGenderText={getGenderText}
                    />

                    <div>
                      <BtnBlock
                        className1={styles["y-btn"]}
                        className2={styles["r-btn"]}
                        className4={styles["button-block"]}
                        label1="Редактировать"
                        label2="Удалить Сотрудника"
                        fnc1={() => handleEdit(employee)}
                        fnc2={() => showMessageDeleteEmployee(employee.id)}
                      />
                      {confirmDeleteEmployee &&
                        employeeToDelete === employee.id && (
                          <Modal
                            toggleOpen={toggleOpen}
                            toggleClose={closeMessageDeleteEmployee}
                            setEmployeeId={setEmployeeId}
                          >
                            <h2 className={styles["choose"]}>
                              Вы действительно хотите удалить сотрудника ?
                            </h2>

                            <BtnBlock
                              className1={styles["g-btn"]}
                              className2={styles["r-btn"]}
                              className4={styles["btn-block"]}
                              label1="Удалить Сотрудника"
                              label2="Отменить удаления"
                              fnc1={() => handleDelete(employee.id)}
                              fnc2={closeMessageDeleteEmployee}
                            />
                          </Modal>
                        )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;
