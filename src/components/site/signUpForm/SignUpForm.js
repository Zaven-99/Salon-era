import React from "react";
import { NavLink } from "react-router-dom";
import Spinner from "../../spinner/Spinner";
import CustomInput from "../../customInput/CustomInput";
import CustomButton from "../../customButton/CustomButton";
import { useSignUpFormState } from "../../hooks/signUpForm/SignUpFormState";
import styles from "./signUpForm.module.scss";
import ImagePreview from "../../uploadImage/imagePreview/ImagePreview";
import UploadImage from "../../uploadImage/UploadImage";

const SignUpForm = ({
  toggleClose,
  toggleShowMessage,
  activeInput,
  setActiveInput,
}) => {
  const {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    showHelpModal,
    toggleHelpModal,
    isDarkMode,
    loading,
    errorMessages,
    handleKeyDown,
    uploadImage,
    deletImagePreview,
    onSubmit,
    imagePreview,
    setErrorMessages,
    register,
    handleSubmit,
    control,
    errors,
    password,
  } = useSignUpFormState({
    toggleClose,
    toggleShowMessage,
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.registration}>Регистрация</h2>

        <CustomInput
          label="Введите имя:"
          error={errors.first_name}
          type="text"
          name="first_name"
          isActive={activeInput === "first_name"}
          setActiveInput={setActiveInput}
          {...register("first_name", {
            required: "Это поле обязательно.",
            minLength: {
              value: 3,
              message: "Имя должен содержать минимум 3 символа.",
            },
          })}
        />
        <CustomInput
          label="Введите фамилию:"
          error={errors.last_name}
          type="text"
          name="last_name"
          isActive={activeInput === "last_name"}
          setActiveInput={setActiveInput}
          {...register("last_name", {
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
          type="login"
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
            onChange: () =>
              setErrorMessages((prev) => ({ ...prev, login: "" })),
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
              validPassword: (value) =>
                value.length >= 8 ||
                "Пароль должен содержать минимум 8 символов",
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
          autoComplete="new-password"
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
            onChange: () =>
              setErrorMessages((prev) => ({ ...prev, email: "" })),
          })}
        />
        <p className={styles["error-message"]}>{errorMessages.phone}</p>
        <CustomInput
          label="Введите номер телефона:"
          onKeyDown={handleKeyDown}
          error={errors.phone}
          maxLength="12"
          name="phone"
          type="tel"
          isActive={activeInput === "phone"}
          setActiveInput={setActiveInput}
          {...register("phone", {
            required: "Это поле обязательно",
            pattern: {
              value: /^\+7\d{10}$/,
              message: "Номер телефона должен содержать 10 цифр",
            },
            onChange: () =>
              setErrorMessages((prev) => ({ ...prev, phone: "" })),
          })}
        />
        <ImagePreview
          deletImagePreview={deletImagePreview}
          imagePreview={imagePreview}
          className={styles.preview}
        />

        <UploadImage onChange={uploadImage} />

        <div>
          <CustomInput
            label="Пол"
            type="radio"
            name="gender"
            error={errors.gender}
            control={control}
            isDarkMode={isDarkMode}
            {...register("gender", { required: "Выберите пол." })}
          />
        </div>

        <CustomButton
          className={styles["signUp-btn"]}
          label="Зарегистрироваться"
          type="submit"
        />
      </form>
      {errors.policy && <p className={styles.error}>{errors.policy.message}</p>}
      <div className={styles["privacy-policy"]}>
        <label className={isDarkMode ? styles["darkmode"] : styles["agree"]}>
          <input
            type="checkbox"
            value="true"
            defaultChecked={false}
            {...register("policy", {
              required: "Вы должны согласиться с политикой конфиденциальности",
            })}
          />
        </label>

        <span className={styles.text}>Я согласен с политикой</span>
        <NavLink to="/privacy-policy" className={styles.policy} target="_blank">
          конфиденциальности
        </NavLink>
      </div>
    </div>
  );
};

export default SignUpForm;
