import React, { useState } from "react";
import { useForm } from "react-hook-form";

import CustomInput from "../../../../customInput/CustomInput";
import CustomButton from "../../../../customButton/CustomButton";
import Spinner from "../../../../spinner/Spinner";

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

  const [loading, setLoading] = useState(false);

  const formSubmitHandler = async (formValues) => {
    setLoading(true);
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify([
        {
          category: "Категория услуг",
          value: formValues.category.trim(),
          type:'Типы категории'
        },
      ])
    );

    try {
      const response = await fetch("https://api.salon-era.ru/catalogs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Ошибка при добавлении услуги");
      }
      reset();

      toggleClose();
      reset();
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
      window.location.reload();
      
    }
  };

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
