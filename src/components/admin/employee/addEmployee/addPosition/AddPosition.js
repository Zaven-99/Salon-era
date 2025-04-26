import React from "react";
import Spinner from "../../../../spinner/Spinner";
import CustomButton from "../../../../customButton/CustomButton";
import CustomInput from "../../../../customInput/CustomInput";
import { AddPositionState } from "../../../../hooks/employee/AddPositionState";

import styles from "./addPosition.module.scss";

const AddPosition = ({ activeInput, setActiveInput, toggleClose }) => {
  const { register, handleSubmit, formSubmitHandler, errors, loading } =
    AddPositionState({ toggleClose });
  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h2>Добавить должность</h2>

      <CustomInput
        label="Должность"
        name="position"
        type="text"
        error={errors.position}
        isActive={activeInput === "position"}
        setActiveInput={setActiveInput}
        {...register("position", {
          required: "Это поле обязательно.",
          minLength: {
            value: 2,
            message: "Название должносты содержать хотя бы одну букву",
          },
        })}
      />

      <CustomButton
        label="Добавить Должность"
        onClick={handleSubmit(formSubmitHandler)}
        className={styles["w-btn"]}
      />
      <CustomButton />
    </div>
  );
};

export default AddPosition;
