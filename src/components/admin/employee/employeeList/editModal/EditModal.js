import React, { useState } from "react";
import CustomInput from "../../../../customInput/CustomInput";
import CustomSelect from "../../../../customSelect/CustomSelect";
import ImagePreview from "../../../../imagePreview/ImagePreview";
import BtnBlock from "../../../../btnBlock/BtnBlock";
import { Controller, useForm } from "react-hook-form";

import styles from "./editModal.module.scss";

const EditModal = ({
  imagePreview,
  setLoading,
  editedEmployee,
  setEmployee,
  setEmployeeId,
  setEditedEmployee,
  setImagePreview,
  toggleHelpModal,
  showHelpModal,
  handleKeyDown,
  positionOptions,
  employee,
}) => {
  const {
    register,
    control,
    formState: { errors },
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
  const [selectedFile, setSelectedFile] = useState(null);

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
      const response = await fetch(`https://api.salon-era.ru/clients/update`, {
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
    setSelectedFile(null);
  };
  return (
    <div className={styles["edit-modal"]}>
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
          minLength: {
            value: 3,
            message: "Фамилия должен содержать минимум 3 символа.",
          },
        })}
      />
      <CustomInput
        label="Введите логин:"
        error={errors.login}
        type="text"
        name="login"
        autoComplete="off"
        value={editedEmployee.login}
        handleChange={handleChange}
        isActive={activeInput === "login"}
        setActiveInput={setActiveInput}
        {...register("login", {
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
        autoComplete="new-password"
        error={errors.password}
        toggleHelpModal={toggleHelpModal}
        showHelpModal={showHelpModal}
        value={editedEmployee.password}
        handleChange={handleChange}
        isActive={activeInput === "password"}
        setActiveInput={setActiveInput}
        {...register("password", {
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
              /\d/.test(value) || "Пароль должен содержать хотя бы одну цифру.",
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
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Введите корректный адрес электронной почты",
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
            map={positionOptions}
            valueType="id"
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
      />

      <BtnBlock
        className1={styles["g-btn"]}
        className2={styles["r-btn"]}
        className4={styles["btn-block"]}
        label1="Сохранить"
        label2="Отменить"
        fnc1={() => handleSave(employee.id)}
        fnc2={() => setEmployeeId(null)}
      />
    </div>
  );
};

export default EditModal;
