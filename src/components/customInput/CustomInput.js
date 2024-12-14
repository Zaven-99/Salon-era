import React, { useState } from "react";
import CustomButton from "../customButton/CustomButton";
import HelpModal from "../site/navList/helpModal/HelpModal";

import question from "../../img/icons/question.png";
import close from "../../img/icons/close.svg";

import styles from "./customInput.module.scss";

const CustomInput = React.forwardRef(
  (
    {
      label,
      error,
      name,
      show,
      showPassword,
      toggleHelpModal,
      showHelpModal,
      type,
      showConfirmPassword,
      onChange,
      value,
      handleChange,
      isActive,
      setActiveInput,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(true);

    const inputType =
      (name === "password" && !showPassword) ||
      (name === "confirmPassword" && !showConfirmPassword)
        ? "password"
        : type;

    const handleInputChange = (e) => {
      if (type === "file") {
        onChange && onChange(e);
      } else {
        const value = e?.target?.value || "";
        setInputValue(value);
        onChange && onChange(e);
      }
    };

    const handleClearInput = () => {
      setInputValue("");
      if (onChange) {
        onChange({ target: { name, value: "" } });
      }
    };

    const onFocusHandler = () => {
      setActiveInput(name);
      if (name === "phone" && !inputValue) {
        setInputValue("+7");
        onChange && onChange({ target: { name, value: "+7" } });
      }
    };
    const onBlurHandler = () => {
      if (inputValue.length === 0) {
        setIsFocused(false);
      }
    };

    return (
      <div className={styles["input-container"]}>
        {type !== "radio" && (
          <div className={styles["input-container__inner"]}>
            <input
              className={`${styles["input-item"]} ${
                error ? styles.error : ""
              } ${!error && inputValue.length > 0 ? styles.active : ""}`}
              placeholder={label}
              type={inputType}
              name={name}
              ref={ref}
              onFocus={onFocusHandler}
              onBlur={onBlurHandler}
              value={value || inputValue || ""}
              onChange={handleChange || handleInputChange}
              {...props}
            />
            {inputValue && inputValue.length > 0 && (
              <CustomButton
                type="button"
                onClick={handleClearInput}
                className={styles["clear-input"]}
              >
                <img src={close} alt="Clear" />
              </CustomButton>
            )}
            {(name === "password" || name === "confirmPassword") && (
              <div className={styles["btn-block"]}>
                {showHelpModal && <HelpModal />}
                <CustomButton
                  type="button"
                  onClick={show}
                  className={styles["show-password"]}
                >
                  {(name === "password" && showPassword) ||
                  (name === "confirmPassword" && showConfirmPassword)
                    ? "Скрыть"
                    : "Показать"}
                </CustomButton>
                {name === "password" && (
                  <p onClick={toggleHelpModal} className={styles.help}>
                    <img src={question} alt="" />
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {type === "radio" && (
          <>
            <div className={styles["gender-block"]}>
              {error && (
                <p className={styles["error-gender"]}>{error.message}</p>
              )}
              <p className={styles["gender"]}>Пол</p>
              <label className={styles["custom-radio"]}>
                <input
                  type="radio"
                  name={name}
                  value="0"
                  onChange={handleChange || handleInputChange}
                  ref={ref}
                />
                Жен.
              </label>
              <label className={styles["custom-radio"]}>
                <input
                  type="radio"
                  name={name}
                  value="1"
                  onChange={handleChange || handleInputChange}
                  ref={ref}
                />
                Муж.
              </label>
            </div>
          </>
        )}
      </div>
    );
  }
);

export default CustomInput;
