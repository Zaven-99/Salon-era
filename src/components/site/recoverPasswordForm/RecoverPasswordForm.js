import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../../customButton/CustomButton";
import CustomInput from "../../customInput/CustomInput";
import styles from "./recoverPassword.module.scss";
import Spinner from "../../spinner/Spinner";

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

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (step === 1) {
        const response = await fetch(
          `http://95.163.84.228:6533/clients/recoveryPassword?send=true&email=${data.email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: data.email }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          const statusCode = response.status;
          if (statusCode === 409) {
            setErrorMessage(
              "Пользователь с таким email уже существует или запрос на восстановление уже отправлен."
            );
          } else {
            throw new Error(`Ошибка: ${errorText}`);
          }
        } else {
          const result = await response.text();
          setSuccessMessage("Письмо для восстановления пароля отправлено.");
          setStep(2);
          setEmail(data.email);
          setVerificationCode(result);
        }
      } else if (step === 2) {
        if (data.code === verificationCode) {
          const formData = new FormData();
          formData.append(
            "clientData",
            JSON.stringify({
              password: data.password,
            })
          );

          const response = await fetch(
            `http://95.163.84.228:6533/clients/changePasswordFromEmail?email=${email}&password=${data.password}`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            setErrorMessage(`Ошибка при изменении пароля: ${errorText}`);
          } else {
            setSuccessMessage("Пароль успешно изменен.");
            setStep(3);
          }
        } else {
          setErrorMessage("Неверный код.");
        }
      }
    } catch (error) {
      setErrorMessage(`Пользователь с ${data.email} не существует`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
