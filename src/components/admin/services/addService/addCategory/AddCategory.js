import React from "react";
import { useForm } from "react-hook-form";
import CustomInput from "../../../../customInput/CustomInput";
import CustomButton from "../../../../customButton/CustomButton";
import Spinner from "../../../../spinner/Spinner";
import { AddCategoryState } from "../../../../hooks/services/addCategoryState";

import styles from "./addCategory.module.scss";


const AddCategory = ({ toggleClose, activeInput, setActiveInput }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      category: "",
    },
  });

  const { loading, formSubmitHandler } = AddCategoryState(toggleClose, reset);
  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h2>Добавить категорию</h2>
      <CustomInput
        label="Категория"
        name="category"
        type="text"
        error={errors.category}
        isActive={activeInput === "category"}
        setActiveInput={setActiveInput}
        {...register("category", {
          required: "Это поле обязательно.",
          minLength: {
            value: 2,
            message: "Название должен содержать минимум 2 символа.",
          },
        })}
      />
      <CustomButton
        label="Добавить категорию"
        onClick={handleSubmit(formSubmitHandler)}
        className={styles["w-btn"]}
      />
    </div>
  );
};

export default AddCategory;
