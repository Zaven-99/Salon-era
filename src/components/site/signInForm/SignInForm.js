import React from "react";

import { SignInFormState } from "../../hooks/signInForm/SignInFormState";
import SignUpForm from "../signUpForm/SignUpForm";
import RecoverPasswordForm from "../recoverPasswordForm/RecoverPasswordForm";
import CustomInput from "../../customInput/CustomInput";
import CustomButton from "../../customButton/CustomButton";
import Spinner from "../../spinner/Spinner";

import styles from "./signInForm.module.scss";

const SignInForm = ({ toggleClose, toggleShowMessage }) => {
  const {
    showFormSignUp,
    setShowFormSignUp,
    showRecoverPasswordForm,
    setRecoverPasswordForm,
    showPassword,
    setShowPassword,
    loading,
    showHelpModal,
    toggleHelpModal,
    errorMessages,
    setErrorMessages,
    activeInput,
    setActiveInput,
    toggleFormSignUp,
    toggleFormRecover,
    handleSubmit,
    register,
    errors,
    onSubmit,
  } = SignInFormState({ toggleClose });

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
            {...register("login", {
              required: "Это поле обязательно.",
              onChange: () =>
                setErrorMessages((prev) => ({ ...prev, login: "" })),
            })}
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
            toggleClose={toggleClose}
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
