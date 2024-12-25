import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomButton from "../../../customButton/CustomButton";
import CustomInput from "../../../customInput/CustomInput";
import Modal from "../../../modal/Modal";

import styles from "./employeeList.module.scss";
import Spinner from "../../../spinner/Spinner";
import ImagePreview from "../../../imagePreview/ImagePreview";
import CustomSelect from "../../../customSelect/CustomSelect";

import avatarImg from "../../../../img/icons/avatar.png";

const EmployeeList = ({
  employee,
  setEmployee,
  toggleHelpModal,
  showHelpModal,
  toggleOpenSignInForm,
  toggleCloseSignInForm,
  handleKeyDown,
}) => {
  const {
    register,
    control,
    formState: { errors },
    setError,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      login: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      position: "",
      dateWorkIn: "",
      gender: "",
      clientType: "employee",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [EmployeeId, setEmployeeId] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({});
  const [confirmDeleteEmployee, setConfirmDeleteEmployee] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const genderMap = { 0: "Женщина", 1: "Мужчина" };

  const positionMap = [
    "Женский парикмахер",
    "Мужской парикмахер",
    "Специалист по маникюру",
    "Бровист",
  ];

  const getPositionText = (position) => {
    if (position >= 1 && position <= positionMap.length) {
      return positionMap[position - 1];
    } else {
      return "Неизвестная позиция";
    }
  };
  const getGenderText = (gender) => genderMap[gender];

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://95.163.84.228:6533/clients/all");

      if (!response.ok) throw new Error("Ошибка при получении сотрудников");
      const data = await response.json();

      const filteredData = data.filter(
        (employee) => employee.clientType === "employee"
      );
      setEmployee(filteredData);
    } catch (error) {
      setError("Ошибка при загрузке сотрудников");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchEmployee();
    })();
  }, []);

  const handleSave = async (id) => {
    setLoading(true);
    const formattedDate = `${editedEmployee.dateWorkIn}`;

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        ...editedEmployee,
        dateWorkIn: formattedDate,
        id,
      })
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch(`http://95.163.84.228:6533/clients/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Ошибка при сохранении услуги: ${errorMessage}`);
      }

      setEmployee((prevEmployee) =>
        prevEmployee.map((employee) =>
          employee.id === id ? editedEmployee : employee
        )
      );
      setEmployeeId(null);
      setEditedEmployee({});
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (employeeToDelete === null) return;
    setLoading(true);

    try {
      const response = await fetch(
        `http://95.163.84.228:6533/clients?id=${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Ошибка при удалении услуги");
      setEmployee((prevEmployee) =>
        prevEmployee.filter((employee) => employee.id !== id)
      );
      closeMessageDeleteEmployee();
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      document.body.style.overflow = "scroll";
      setLoading(false);
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
    return <p className={styles.message}>Список сотрудников пуст</p>;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = (event) => {
    const files = event?.target?.files;
    if (!files || files.length === 0) {
      console.error("Файлы не найдены или пусты");
      return;
    }

    const file = files[0];
    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Выберите файл изображения.");
    }
  };
  const deletImagePreview = () => {
    setImagePreview(null);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["employee-list"]}>
      <h1 className={styles.employee}>Сотрудники</h1>

      {Object.keys(groupedEmployee).map((position) => (
        <div key={position}>
          <h4 className={styles.category}>{getPositionText(position)}</h4>

          <ul className={styles["employee-list__inner"]}>
            {groupedEmployee[position].map((employee, index) => (
              <li className={styles["employee-item"]} key={index}>
                {EmployeeId === employee.id ? (
                  <Modal
                    toggleOpenSignInForm={toggleOpenSignInForm}
                    toggleCloseSignInForm={toggleCloseSignInForm}
                    setEmployeeId={setEmployeeId}
                  >
                    <>
                      <h2>Редактировать</h2>
                      <CustomInput
                        label="Введите имя:"
                        error={errors.firstName}
                        type="text"
                        name="firstName"
                        value={editedEmployee.firstName}
                        handleChange={handleChange}
                        isActive={activeInput === "firstName"}
                        setActiveInput={setActiveInput}
                        {...register("firstName", {
                          required: "Это поле обязательно.",
                          minLength: {
                            value: 3,
                            message: "Имя должен содержать минимум 3 символа.",
                          },
                        })}
                      />
                      <CustomInput
                        label="Введите фамилию:"
                        error={errors.lastName}
                        type="text"
                        name="lastName"
                        value={editedEmployee.lastName}
                        handleChange={handleChange}
                        isActive={activeInput === "lastName"}
                        setActiveInput={setActiveInput}
                        {...register("lastName", {
                          required: "Это поле обязательно.",
                          minLength: {
                            value: 3,
                            message:
                              "Фамилия должен содержать минимум 3 символа.",
                          },
                        })}
                      />
                      <CustomInput
                        label="Введите логин:"
                        error={errors.login}
                        type="text"
                        name="login"
                        value={editedEmployee.login}
                        handleChange={handleChange}
                        isActive={activeInput === "login"}
                        setActiveInput={setActiveInput}
                        {...register("login", {
                          required: "Это поле обязательно.",
                          minLength: {
                            value: 3,
                            message:
                              "Логин должен содержать минимум 3 символа.",
                          },
                          maxLength: {
                            value: 20,
                            message: "Логин не должен превышать 20 символов.",
                          },
                        })}
                      />
                      <CustomInput
                        label="Введите пароль:"
                        show={() => setShowPassword((prev) => !prev)}
                        showPassword={showPassword}
                        error={errors.password}
                        toggleHelpModal={toggleHelpModal}
                        showHelpModal={showHelpModal}
                        value={editedEmployee.password}
                        handleChange={handleChange}
                        isActive={activeInput === "password"}
                        setActiveInput={setActiveInput}
                        {...register("password", {
                          required: "Это поле обязательно.",
                          minLength: {
                            value: 8,
                            message:
                              "Пароль должен содержать минимум 8 символов.",
                          },
                          validate: {
                            hasUpperCase: (value) =>
                              /[A-Z]/.test(value) ||
                              "Пароль должен содержать хотя бы одну заглавную букву.",
                            hasLowerCase: (value) =>
                              /[a-z]/.test(value) ||
                              "Пароль должен содержать хотя бы одну строчную букву.",
                            hasNumber: (value) =>
                              /\d/.test(value) ||
                              "Пароль должен содержать хотя бы одну цифру.",
                            hasSpecialChar: (value) =>
                              /[!@#$%^&*._-]/.test(value) ||
                              "Пароль должен содержать хотя бы один специальный символ: ! @ # $ % ^ & * . - _",
                            hasCyrillic: (value) =>
                              !/[а-яА-ЯЁё]/.test(value) ||
                              "Пароль не должен содержать кириллические символы.",
                          },
                        })}
                      />

                      <CustomInput
                        label="Введите почту:"
                        name="email"
                        type="email"
                        error={errors.email}
                        value={editedEmployee.email}
                        handleChange={handleChange}
                        isActive={activeInput === "email"}
                        setActiveInput={setActiveInput}
                        {...register("email", {
                          required: "Это поле обязательно",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message:
                              "Введите корректный адрес электронной почты",
                          },
                        })}
                      />
                      <CustomInput
                        label="Введите номер телефона:"
                        error={errors.phone}
                        name="phone"
                        type="tel"
                        value={editedEmployee.phone}
                        handleChange={handleChange}
                        isActive={activeInput === "phone"}
                        setActiveInput={setActiveInput}
                        onKeyDown={handleKeyDown}
                        {...register("phone", {
                          required: "Это поле обязательно",
                          pattern: {
                            value: /^\+7\d{10}$/,
                            message: "Номер телефона должен содержать 10 цифр",
                          },
                        })}
                      />
                      <CustomInput
                        label="Укажите дату трудоустройства"
                        type="date"
                        name="dateWorkIn"
                        value={editedEmployee.dateWorkIn.slice(0, -6) || ""}
                        handleChange={handleChange}
                        isActive={activeInput === "dateWorkIn"}
                        setActiveInput={setActiveInput}
                        {...register("dateWorkIn", {
                          required: "Это поле обязательно",
                        })}
                      />

                      <Controller
                        name="position"
                        control={control}
                        rules={{ required: "Это поле обязательно" }}
                        render={({ field }) => (
                          <CustomSelect
                            {...field}
                            name="position"
                            edited={editedEmployee.position}
                            handleChange={handleChange}
                            control={control}
                            map={positionMap}
                            rules={{ required: "Это поле обязательно" }}
                          />
                        )}
                      />

                      <ImagePreview
                        deletImagePreview={deletImagePreview}
                        imagePreview={imagePreview}
                      />
                      <CustomInput
                        type="file"
                        name="imageLink"
                        placeholder="Выберите изображение"
                        isActive={activeInput === "imageLink"}
                        setActiveInput={setActiveInput}
                        onChange={uploadImage}
                      />
                      <CustomInput
                        label="Пол"
                        type="radio"
                        name="gender"
                        value={editedEmployee.gender}
                        handleChange={handleChange}
                        control={control}
                        {...register("gender", {
                          required: "Выберите пол.",
                        })}
                      />

                      <div className={styles["btn-block"]}>
                        <CustomButton
                          className={styles["save-employee"]}
                          type="button"
                          label="Сохранить"
                          onClick={() => handleSave(employee.id)}
                        />
                        <CustomButton
                          className={styles["cancel"]}
                          type="button"
                          label="Отменить"
                          onClick={() => setEmployeeId(null)}
                        />
                      </div>
                    </>
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
                        <>
                          <img
                            className={styles["image-employee"]}
                            src={avatarImg}
                            alt=""
                          />
                        </>
                      )}
                    </div>
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
                      <strong>Пароль:</strong> <div>{employee.password}</div>
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
                      <strong>Пол:</strong>{" "}
                      <div>{getGenderText(employee.gender)}</div>
                    </div>
                    <div className={styles["button-block"]}>
                      <CustomButton
                        className={styles["edit-employee"]}
                        type="button"
                        label="Редактировать"
                        onClick={() => handleEdit(employee)}
                      />
                      <CustomButton
                        className={styles["delete-employee"]}
                        type="button"
                        label="Удалить Сотрудника"
                        onClick={() => showMessageDeleteEmployee(employee.id)}
                      />
                      {confirmDeleteEmployee &&
                        employeeToDelete === employee.id && (
                          <div className={styles["modal-overlay"]}>
                            <div className={styles["modal-content"]}>
                              <h2 className={styles["choose-dateWorkOut"]}>
                                Вы действительно хотите удалить сотрудника ?
                              </h2>

                              <div className={styles["btn-block"]}>
                                <CustomButton
                                  className={styles["delete-employee"]}
                                  type="button"
                                  label="Удалить Сотрудника"
                                  onClick={() => handleDelete(employee.id)}
                                />
                                <CustomButton
                                  className={styles["cancel-delete__employee"]}
                                  type="button"
                                  label="Отменить удаления"
                                  onClick={closeMessageDeleteEmployee}
                                />
                              </div>
                            </div>
                          </div>
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
