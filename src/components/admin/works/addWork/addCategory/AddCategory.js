import React from "react";
import Spinner from "../../../../spinner/Spinner";
import CustomButton from "../../../../customButton/CustomButton";
import CustomInput from "../../../../customInput/CustomInput";
import { AddCategoryState } from "../../../../hooks/works/AddCategoryState";
import styles from "../addCategory/addCategory.module.scss";

const AddCategoryWork = ({ toggleClose, activeInput, setActiveInput }) => {
  const { register, handleSubmit, errors, loading, formSubmitHandler } =
    AddCategoryState(toggleClose);

  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      <h2>Добавить название работы</h2>
      <CustomInput
        label="Название работы"
        name="work"
        type="text"
        error={errors.work}
        isActive={activeInput === "work"}
        setActiveInput={setActiveInput}
        {...register("work", {
          minLength: {
            value: 0,
            message: "",
          },
        })}
      />
      <CustomButton
        label="Добавить название работы"
        className={styles["w-btn"]}
        onClick={handleSubmit(formSubmitHandler)}
        type="submit"
      />
    </div>
  );
};

export default AddCategoryWork;
