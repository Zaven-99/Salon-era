import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/slices/userSlice";
import { NavLink, useNavigate } from "react-router-dom";
import Spinner from "../../spinner/Spinner";
import CustomInput from "../../customInput/CustomInput";
import CustomButton from "../../customButton/CustomButton";

import styles from "./signUpForm.module.scss";
import ImagePreview from "../../imagePreview/ImagePreview";

const SignUpForm = ({
  toggleCloseSignInForm,
  toggleShowMessage,
  activeInput,
  setActiveInput,
}) => {
  const {
    register,
    handleSubmit,
    watch,
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
      phone: "+7",
      imageLink: "",
      gender: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [policy, setPolicy] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  const handleKeyDown = (e) => {
    const value = e.target.value;

    if (value === "+7") {
      if (e.key === "Backspace") {
        e.preventDefault();
      }
    }
    if (!/[0-9+]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const password = watch("password");

  const handlePolicyChange = (e) => {
    setPolicy(e.target.checked);
  };

  const onSubmit = async (formValues, e) => {
    e.preventDefault();

    const { confirmPassword, gender, patronymic, ...dataToSend } = formValues;

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        ...dataToSend,
        gender: parseInt(formValues.gender),
        patronymic: "0",
      })
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }
    if (!policy) {
      setError(true);
      setLoading(false);
      return;
    } else {
      try {
        const response = await fetch("http://95.163.84.228:6533/clients", {
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

        const data = await response.json();

        const imageLink = data.imageLink || imagePreview;
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: formValues.id,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            phone: formValues.phone,
            gender: formValues.gender,
            imageLink,
            token: true,
          })
        );

        dispatch(
          setUser({
            ...formValues,
            id: data.id,
            gender: parseInt(formValues.gender),
            imageLink,
            token: true,
          })
        );

        navigate("/");
        toggleCloseSignInForm();
        toggleShowMessage();
      } catch (error) {
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
        } else if (status === 443) {
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
        setError(false);
      }
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.registration}>Регистрация</h2>

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
          })}
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

        <div>
          <CustomInput
            label="Пол"
            type="radio"
            name="gender"
            error={errors.gender}
            control={control}
            {...register("gender", { required: "Выберите пол." })}
          />
        </div>
        <CustomButton
          className={styles["signUp-btn"]}
          label="Зарегистрироваться"
          type="submit"
          disabled={!policy}
        />
      </form>
      {errors.policy && <p className={styles.error}>{errors.policy.message}</p>}
      <div className={styles["privacy-policy"]}>
        <label className={styles["agree"]}>
          <input
            value=""
            name="policy"
            type="radio"
            checked={policy}
            onChange={handlePolicyChange}
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
