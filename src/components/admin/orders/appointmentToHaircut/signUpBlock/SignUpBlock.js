import React,{useState} from "react";
import CustomButton from "../../../../customButton/CustomButton";
import CustomInput from "../../../../customInput/CustomInput";
import { useForm } from "react-hook-form";

import styles from "./signUpBlock.module.scss";

const SignUpBlock = ({
  setSuccesSignUp,
  setLoading,
  setClient,
  setOfferModal,
  activeInput,
  setActiveInput,
  handleKeyDown,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "",
    },
  });

  const [errorMessages, setErrorMessages] = useState(false);

  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  }

  function generateRandomEmail() {
    const domains = ["gmail.com", "yahoo.com", "mail.ru", "outlook.com"];
    const username = generateRandomString(8);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
  }

  const onSubmit = async (formValues, e) => {
    const { gender, patronymic, policy, ...dataToSend } = formValues;

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify([{
        ...dataToSend,
        login: generateRandomString(5),
        password: "Password123.",
        email: generateRandomEmail(10),
        gender: parseInt(formValues.gender),
        patronymic: "0",
      }])
    );

    setSuccesSignUp(true);
    reset();
    toggleCloseOfferModal();
    setTimeout(() => {
      setSuccesSignUp(false);
    }, 1300);

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
      } else {
        setLoading(true);
        const responseData = await response.json();
        setClient(responseData);
      }
    } catch (error) {
      const errorData = JSON.parse(error.message);
      const status = errorData.status;

      if (status === 442) {
        setErrorMessages((prev) => ({
          ...prev,
          phone: `Пользователь с номером ${formValues.phone} уже существует`,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCloseOfferModal = () => {
    setOfferModal(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["modal-content"]}>
      <span className={styles["form-close"]} onClick={toggleCloseOfferModal}>
        &#10005;
      </span>
      <p className={styles.error}>Клиент не найден!</p>
      <h3>Зарегистрировать клиента</h3>

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
      {errorMessages && errorMessages.phone && (
        <p className={styles.error}>{errorMessages.phone}</p>
      )}
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
          onChange: () => setErrorMessages((prev) => ({ ...prev, phone: "" })),
        })}
      />
      <CustomInput
        label="Пол"
        type="radio"
        name="gender"
        control={control}
        error={errors.gender}
        {...register("gender", { required: "Выберите пол." })}
      />
      <CustomButton
        className={styles["sign-up__button"]}
        label="Зарегистрировать клиента"
        type="submit"
      />
    </form>
  );
};

export default SignUpBlock;
