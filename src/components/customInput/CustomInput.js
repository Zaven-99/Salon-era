import React, { useRef, useState } from "react";
import CustomButton from "../customButton/CustomButton";
import HelpModal from "../site/navList/helpModal/HelpModal";
import { useDispatch } from "react-redux";
import { clearBarber } from "../../store/slices/barberSlice.js";
import { clearServices } from "../../store/slices/serviceSlice.js";
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
      isDarkMode,
      setClient,
      setSelectedTime,
      categoryOptions,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const dispatch = useDispatch();

    const innerRef = useRef(null);
    const inputRef = ref ?? innerRef;

    const inputType =
      (name === "password" && !showPassword) ||
      (name === "confirmPassword" && !showConfirmPassword)
        ? "password"
        : type;

    const handleInputChange = (e) => {
      if (type === "file") {
        onChange?.(e);
      } else {
        const val = e?.target?.value || "";
        setInputValue(val);
        onChange?.(e);
      }
    };

    const handleClearInput = () => {
      setInputValue("");
      onChange?.({ target: { name, value: "" } });

      if (setClient) {
        setClient(null);
        setSelectedTime?.(null);
        dispatch(clearServices());
        dispatch(clearBarber());
      }
    };

    const onFocusHandler = () => {
      setActiveInput?.(name);
      if (name === "phone" && !inputValue) {
        setInputValue("+7");
        onChange?.({ target: { name, value: "+7" } });
      }
    };

    const showClear = (value || inputValue)?.length > 0;

    return (
      <div className={styles["input-container"]}>
        {type !== "radio" && (
          <div className={styles["input-container__inner"]}>
            <input
              className={`${styles["input-item"]} ${
                error ? styles.error : ""
              } ${
                !error && (value || inputValue)?.length > 0 ? styles.active : ""
              }`}
              placeholder={label}
              type={inputType}
              name={name}
              ref={inputRef}
              onFocus={onFocusHandler}
              value={value ?? inputValue}
              onChange={handleChange || handleInputChange}
              autoComplete="new-password"
              {...props}
            />
            {showClear && !value && (
              <CustomButton
                type="button"
                onClick={handleClearInput}
                className={styles["clear-input"]}
              >
                <div className={styles["clear"]}>
                  <img src={close} alt="Очистить" />
                </div>
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
                    <img src={question} alt="?" />
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {type === "radio" && (
          <div className={styles["gender-block"]}>
            {error && <p className={styles["error-gender"]}>{error.message}</p>}
            <p className={styles["gender"]}>Пол</p>
            <label
              className={
                isDarkMode ? styles["darkmode"] : styles["custom-radio"]
              }
            >
              <input
                type="radio"
                name={name}
                value="0"
                onChange={handleChange || handleInputChange}
                ref={inputRef}
              />
              Жен.
            </label>
            <label
              className={
                isDarkMode ? styles["darkmode"] : styles["custom-radio"]
              }
            >
              <input
                type="radio"
                name={name}
                value="1"
                onChange={handleChange || handleInputChange}
                ref={inputRef}
              />
              Муж.
            </label>
          </div>
        )}
      </div>
    );
  }
);

export default CustomInput;

 