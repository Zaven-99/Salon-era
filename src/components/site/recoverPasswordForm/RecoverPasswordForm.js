import React from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../../customButton/CustomButton";
import CustomInput from "../../customInput/CustomInput";
import styles from "./recoverPassword.module.scss";
import Spinner from "../../spinner/Spinner";
import { RecoverPasswordFormState } from "../../hooks/recoveryPasswordForm/recoveryPasswordFormState";
const RecoverPasswordForm = ({
  activeInput,
  setActiveInput,
  toggleHelpModal,
  showHelpModal,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
      code: "",
      email: "",
    },
  });
  const {
    loading,
    errorMessage,
    successMessage,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    step,
    onSubmit,
  } = RecoverPasswordFormState();

  const password = watch("password");

  if (loading) {
    return <Spinner />;
  }

  const getStepForm = () => {
    if (step === 1) {
      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles["recover-password"]}>Введите почту</h2>
            {errorMessage && (
              <p className={styles["error-message"]}>{errorMessage}</p>
            )}
            {successMessage && (
              <p className={styles["success-message"]}>{successMessage}</p>
            )}
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
            <CustomButton
              className={styles.btn}
              type="submit"
              label="Отправить код"
            />
          </form>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles["recover-password"]}>
              Введите код и новый пароль
            </h2>
            {errorMessage && (
              <p className={styles["error-message"]}>{errorMessage}</p>
            )}
            <CustomInput
              label="Введите код из письма:"
              name="code"
              type="text"
              autoComplete="new-password"
              error={errors.code}
              isActive={activeInput === "code"}
              setActiveInput={setActiveInput}
              {...register("code", { required: "Это поле обязательно" })}
            />
            <CustomInput
              label="Введите новый пароль:"
              show={() => setShowPassword((prev) => !prev)}
              name="password"
              showPassword={showPassword}
              error={errors.password}
              isActive={activeInput === "password"}
              setActiveInput={setActiveInput}
              toggleHelpModal={toggleHelpModal}
              showHelpModal={showHelpModal}
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
              label="Подтвердите новый пароль:"
              name="confirmPassword"
              show={() => setShowConfirmPassword((prev) => !prev)}
              showConfirmPassword={showConfirmPassword}
              error={errors.confirmPassword}
              isActive={activeInput === "confirmPassword"}
              setActiveInput={setActiveInput}
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Это поле обязательно.",
                validate: (value) =>
                  value === password || "Пароли не совпадают",
              })}
            />
            <CustomButton
              className={styles.btn}
              type="submit"
              label="Сменить пароль"
            />
          </form>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div>
          <h2 className={styles["recover-password"]}>
            Пароль успешно изменен!
          </h2>

          <CustomButton
            onClick={() => (window.location.href = "/")}
            label="На главную"
            className={styles.btn}
          />
        </div>
      );
    }
  };

  return <div>{getStepForm()}</div>;
};

export default RecoverPasswordForm;
