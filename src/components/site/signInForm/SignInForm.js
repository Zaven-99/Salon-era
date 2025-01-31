import React, { useState } from "react";
import { setUser } from "../../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import SignUpForm from "../signUpForm/SignUpForm";
import RecoverPasswordForm from "../recoverPasswordForm/RecoverPasswordForm";
import CustomInput from "../../customInput/CustomInput";
import CustomButton from "../../customButton/CustomButton";
import Spinner from "../../spinner/Spinner";

import styles from "./signInForm.module.scss";

const SignInForm = ({ toggleCloseSignInForm, toggleShowMessage }) => {
  const [showFormSignUp, setShowFormSignUp] = useState(false);
  const [showRecoverPasswordForm, setRecoverPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [activeInput, setActiveInput] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  const toggleFormSignUp = () => {
    setShowFormSignUp(!showFormSignUp);
  };

  const toggleFormRecover = () => {
    setRecoverPasswordForm(!showRecoverPasswordForm);
  };

  const onSubmit = async (formValues) => {
     
    const formData = {
      ...formValues,
    };

    try {
      const response = await fetch("https://api.salon-era.ru/clients/auth", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer true",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const statusCode = response.status;

        throw new Error(
          JSON.stringify({ message: errorText, status: statusCode })
        );
      }

      const data = await response.json();

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          login: data.login,
          phone: data.phone,
          email: data.email,
          gender: data.gender,
          imageLink: data.imageLink,
          clientType: data.clientType,
          token: true,
        })
      );

      dispatch(
        setUser({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          login: data.login,
          phone: data.phone,
          email: data.email,
          gender: data.gender,
          imageLink: data.imageLink,
          clientType: data.clientType,
          token: true,
        })
      );

      if (data.clientType === "admin") {
        navigate("/adminPanel/orders");
      } else {
        navigate("/");
      }
      toggleCloseSignInForm();
    } catch (error) {
      const errorData = JSON.parse(error.message);
      const status = errorData.status;
      console.error("Ошибка при запросе:", errorMessages);
      if (status === 404) {
        setErrorMessages((prev) => ({
          ...prev,
          login: `Неверный логин или пароль`,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.signInForm}>
      {!showFormSignUp && !showRecoverPasswordForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className={styles.logIn}>Войти в аккаунт</h2>
          <p className={styles["error-message"]}>{errorMessages.login}</p>
          <CustomInput
            label="Введите логин"
            type="login"
            name="login"
            error={errors.login}
            isActive={activeInput === "login"}
            setActiveInput={setActiveInput}
            {...register("login", { required: "Это поле обязательно." })}
          />

          <CustomInput
            label="Введите пароль"
            type={showPassword ? "text" : "password"}
            name="password"
            showPassword={showPassword}
            show={() => setShowPassword((prev) => !prev)}
            toggleHelpModal={toggleHelpModal}
            showHelpModal={showHelpModal}
            error={errors.password}
            isActive={activeInput === "password"}
            setActiveInput={setActiveInput}
            {...register("password", { required: "Это поле обязательно." })}
          />
          <CustomButton
            className={styles["signIn-btn"]}
            type="submit"
            label="Войти"
          />
        </form>
      )}

      <div>
        <div className={styles["alternative-choice"]}>
          {showFormSignUp || showRecoverPasswordForm ? (
            <span
              className={styles["back-btn"]}
              onClick={() => {
                setShowFormSignUp(false);
                setRecoverPasswordForm(false);
              }}
            >
              назад
            </span>
          ) : (
            <>
              <span
                className={styles["forgot-your-btn"]}
                onClick={toggleFormRecover}
              >
                Забыли пароль ?
              </span>
              <span className={styles["signUp-btn"]} onClick={toggleFormSignUp}>
                Регистрация
              </span>
            </>
          )}
        </div>

        {showFormSignUp && (
          <SignUpForm
            toggleCloseSignInForm={toggleCloseSignInForm}
            toggleShowMessage={toggleShowMessage}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
          />
        )}
        {showRecoverPasswordForm && (
          <RecoverPasswordForm
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            toggleHelpModal={toggleHelpModal}
            showHelpModal={showHelpModal}
          />
        )}
      </div>
    </div>
  );
};

export default SignInForm;
