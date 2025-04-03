import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../../../spinner/Spinner";
import CustomButton from "../../../../customButton/CustomButton";
import CustomInput from "../../../../customInput/CustomInput";

import styles from './addPosition.module.scss'

const AddPosition = ({ activeInput, setActiveInput, toggleClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      position: "",
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
          category: "Должность",
          value: formValues.position,
          type: "Типы должностей",
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
        className={styles['w-btn']}
      />
      <CustomButton />
    </div>
  );
};

export default AddPosition;
