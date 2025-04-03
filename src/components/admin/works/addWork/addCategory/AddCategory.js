import React, {useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../../../spinner/Spinner";
import CustomButton from "../../../../customButton/CustomButton";
import CustomInput from "../../../../customInput/CustomInput";

import styles from '../addCategory/addCategory.module.scss'

const AddCategoryWork = ({ toggleClose, activeInput, setActiveInput }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      work: "",
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
          category: "Категория работ",
          type: "Тип работ",
          value: formValues.work,
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
