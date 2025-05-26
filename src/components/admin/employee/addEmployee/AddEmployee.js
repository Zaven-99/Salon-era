import React from "react";
import { Controller } from "react-hook-form";

import CustomButton from "../../../customButton/CustomButton";
import CustomInput from "../../../customInput/CustomInput";
import ImagePreview from "../../../uploadImage/imagePreview/ImagePreview";
import CustomSelect from "../../../customSelect/CustomSelect";
import { AddEmployeeState } from "../../../hooks/employee/AddEmployeeState";
import Modal from "../../../modal/Modal";
import AddPosition from "./addPosition/AddPosition";
import DeletePosition from "./deletePosition/DeletePosition";
import Spinner from "../../../spinner/Spinner";
import UploadImage from "../../../uploadImage/UploadImage";
import styles from "./addEmployee.module.scss";

const AddEmployee = ({
  setLoading,
  setEmployee,
  toggleClose,
  toggleHelpModal,
  showHelpModal,
  handleKeyDown,
  positions,
}) => {
  const {
    register,
    handleSubmit,
    control,
    errors,
    password,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    activeInput,
    setActiveInput,
    errorMessages,
    imagePreview,
    uploadImage,
    deletImagePreview,
    onSubmit,
    addPosition,
    deletePosition,
    toggleOpenAddPosition,
    toggleCloseAddPosition,
    toggleOpenDeletePosition,
    toggleCloseDeletePosition,
    categories,
    loading,
  } = AddEmployeeState({ setLoading, setEmployee, toggleClose });

  if (loading) {
    return <Spinner />;
  }

  return (
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
        autoComplete="new-password"
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
        label="Подтвердите пароль:"
        show={() => setShowConfirmPassword((prev) => !prev)}
        showConfirmPassword={showConfirmPassword}
        error={errors.confirmPassword}
        isActive={activeInput === "confirmPassword"}
        setActiveInput={setActiveInput}
        {...register("confirmPassword", {
          required: "Это поле обязательно.",
          validate: (value) => value === password || "Пароли не совпадают",
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
        error={errors.dateWorkIn}
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
            map={positions}
            valueType="id"
            error={errors.position}
          />
        )}
      />
      <div className={styles["btn-block"]}>
        <CustomButton
          label="Добавить должность"
          onClick={toggleOpenAddPosition}
          className={styles["g-btn"]}
        />
        <CustomButton
          label="Удалить должность"
          onClick={toggleOpenDeletePosition}
          className={styles["r-btn"]}
        />
      </div>

      {addPosition && (
        <Modal
          toggleOpen={toggleOpenAddPosition}
          toggleClose={toggleCloseAddPosition}
        >
          <AddPosition
            toggleClose={toggleCloseAddPosition}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
          />
        </Modal>
      )}

      {deletePosition && (
        <Modal
          toggleOpen={toggleOpenDeletePosition}
          toggleClose={toggleCloseDeletePosition}
        >
          <DeletePosition toggleClose={toggleCloseDeletePosition} />
        </Modal>
      )}

      <ImagePreview
        deletImagePreview={deletImagePreview}
        imagePreview={imagePreview}
        className={styles.preview}
      />

      <UploadImage onChange={uploadImage} />

      <h5 className={styles["choose-category"]}>
        Выберите категорию услуг для мастера
      </h5>
      <div className={styles["block-checkbox"]}>
        {categories.map((category) => (
          <div key={category.id}>
            <label className={styles.check}>
              <input
                name="arrayTypeWork"
                type="checkbox"
                value={category.id}
                {...register("arrayTypeWork")}
              />
              {category.value}
            </label>
          </div>
        ))}
      </div>

      <CustomInput
        label="Пол"
        type="radio"
        name="gender"
        control={control}
        {...register("gender", { required: "Выберите пол." })}
      />
      <CustomButton
        className={styles["b-btn"]}
        type="submit"
        label="Добавить сотрудника"
      />
    </form>
  );
};

export default AddEmployee;
