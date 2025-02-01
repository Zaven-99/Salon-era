import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomButton from "../../customButton/CustomButton";
import CustomInput from "../../customInput/CustomInput";
import EmployeeList from "./employeeList/EmployeeList";
import Modal from "../../modal/Modal";
import CustomSelect from "../../customSelect/CustomSelect";
import Spinner from "../../spinner/Spinner";

import styles from "./employeeField.module.scss";
import ImagePreview from "../../imagePreview/ImagePreview";

const EmployeeField = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
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
      position: "1",
      dateWorkIn: "",
      gender: "",
      imageLink: "",
      clientType: "employee",
    },
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [addEmployee, setAddEmployee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const positionMap = [
    "Женский парикмахер",
    "Мужской парикмахер",
    "Специалист по маникюру",
    "Бровист",
    "Специалист по ресницам",
  ];

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

  const toggleOpenSignInForm = () => {
    setAddEmployee(true);
    document.body.style.overflow = "hidden";
  };
  const toggleCloseSignInForm = () => {
    setAddEmployee(false);
    document.body.style.overflow = "scroll";
  };
  const password = watch("password");

  const onSubmit = async (formValues) => {
    // setLoading(true);
    const { confirmPassword, ...dataToSend } = formValues;
    const dateWorkIn = new Date(formValues.dateWorkIn);

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        ...dataToSend,
        dateWorkIn: dateWorkIn.toISOString().slice(0, -1),
        clientType: "employee",
      })
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }
    try {
      const response = await fetch("https://api.salon-era.ru/clients", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        const statusCode = response.status;
        throw new Error(
          JSON.stringify({ message: errorText, status: statusCode })
        );
      }

      setEmployee((prev) => [...prev, dataToSend]);
      toggleCloseSignInForm();
      reset();
    } catch (error) {
      console.error("Ошибка отправки:", error);

      const errorData = JSON.parse(error.message);
      const status = errorData.status;

      if (status === 441) {
        setErrorMessages((prev) => ({
          ...prev,
          login: `Пользователь с логином ${formValues.login} уже существует`,
        }));
      } else if (status === 442) {
        setErrorMessages((prev) => ({
          ...prev,
          phone: `Пользователь с номером ${formValues.phone} уже существует`,
        }));
      } else if (status === 6533) {
        setErrorMessages((prev) => ({
          ...prev,
          email: `Клиент с указанным почтовым адресом ${formValues.email} уже существует`,
        }));
      } else {
        setErrorMessages((prev) => ({
          ...prev,
          general:
            "Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.",
        }));
      }
    } finally {
      setLoading(false);
      deletImagePreview();
    }
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
    <div className={styles["employee-field"]}>
      <CustomButton
        className={styles["add-employee"]}
        label="Добавить сотрудника"
        onClick={toggleOpenSignInForm}
      />
      {addEmployee && (
        <Modal
          toggleOpenSignInForm={toggleOpenSignInForm}
          toggleCloseSignInForm={toggleCloseSignInForm}
        >
          <h2>Добавить сотрудника</h2>
          <form
            className={styles["employee-field__inner"]}
            onSubmit={handleSubmit(onSubmit)}
          >
            <CustomInput
              label="Введите имя:"
              error={errors.firstName}
              type="text"
              name="firstName"
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
              isActive={activeInput === "lastName"}
              setActiveInput={setActiveInput}
              {...register("lastName", {
                required: "Это поле обязательно.",
                minLength: {
                  value: 3,
                  message: "Фамилия должен содержать минимум 3 символа.",
                },
              })}
            />
            <p className={styles["error-message"]}>{errorMessages.login}</p>

            <CustomInput
              label="Введите логин:"
              error={errors.login}
              type="text"
              name="login"
              isActive={activeInput === "login"}
              setActiveInput={setActiveInput}
              {...register("login", {
                required: "Это поле обязательно.",
                minLength: {
                  value: 3,
                  message: "Логин должен содержать минимум 3 символа.",
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
              isActive={activeInput === "password"}
              setActiveInput={setActiveInput}
              {...register("password", {
                required: "Это поле обязательно.",
                minLength: {
                  value: 8,
                  message: "Пароль должен содержать минимум 8 символов.",
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
              label="Подтвердите пароль:"
              show={() => setShowConfirmPassword((prev) => !prev)}
              showConfirmPassword={showConfirmPassword}
              error={errors.confirmPassword}
              isActive={activeInput === "confirmPassword"}
              setActiveInput={setActiveInput}
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password || "Пароли не совпадают",
              })}
            />
            <p className={styles["error-message"]}>{errorMessages.email}</p>

            <CustomInput
              label="Введите почту:"
              name="email"
              type="email"
              error={errors.email}
              isActive={activeInput === "email"}
              setActiveInput={setActiveInput}
              {...register("email", {
                required: "Это поле обязательно",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Введите корректный адрес электронной почты",
                },
              })}
            />
            <p className={styles["error-message"]}>{errorMessages.phone}</p>

            <CustomInput
              label="Введите номер телефона:"
              error={errors.phone}
              name="phone"
              type="tel"
              isActive={activeInput === "phone"}
              setActiveInput={setActiveInput}
              onKeyDown={handleKeyDown}
              {...register("phone", {
                required: "Это поле обязательно",
                pattern: {
                  value: /^\+7\d{10}$/,
                  message: "Неккоректный номер телефона",
                },
              })}
            />
            <CustomInput
              label="Укажите дату трудоустройства"
              type="date"
              name="dateWorkIn"
              isActive={activeInput === "dateWorkIn"}
              setActiveInput={setActiveInput}
              {...register("dateWorkIn", {
                required: "Это поле обязательно",
              })}
            />

            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  name="position"
                  control={control}
                  map={positionMap}
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
              control={control}
              {...register("gender", { required: "Выберите пол." })}
            />
            <CustomButton
              className={styles["accept-add__employee"]}
              type="submit"
              label="Добавить сотрудника"
            />
          </form>
        </Modal>
      )}

      <EmployeeList
        employee={employee}
        setEmployee={setEmployee}
        loading={loading}
        setLoading={setLoading}
        toggleHelpModal={toggleHelpModal}
        showHelpModal={showHelpModal}
        toggleOpenSignInForm={toggleOpenSignInForm}
        toggleCloseSignInForm={toggleCloseSignInForm}
        handleKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default EmployeeField;
