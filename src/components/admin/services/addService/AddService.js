import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../../../customInput/CustomInput";
import CustomButton from "../../../customButton/CustomButton";
import CustomSelect from "../../../customSelect/CustomSelect";
import AddCategory from "./addCategory/AddCategory";
import Modal from "../../../modal/Modal";
import DeleteCategory from "./deleteCategory/DeleteCategory";
import styles from "./addService.module.scss";

const AddService = ({
  setLoading,
  activeInput,
  setActiveInput,
  categoryOptions,
  dur,
  setServices,
  toggleClose,
  setErrorMessage,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      priceLow: "",
      priceMax: "",
      category: "",
      description: "",
      duration: "",
      gender: "",
    },
  });

  const [addCategory, setAddCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const toggleOpenAddCategory = () => {
    setAddCategory(true);
  };

  const toggleCloseAddCategory = () => {
    setAddCategory(false);
  };

  const toggleOpenDeleteCategory = () => {
    setDeleteCategory(true);
  };
  const toggleCloseDeleteCategory = () => {
    setDeleteCategory(false);
  };

  const formSubmitHandler = async (formValues) => {
    setLoading(true);
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify([
        {
          name: formValues.name,
          description: formValues.description,
          category: formValues.category,
          priceLow: parseInt(formValues.priceLow) || 0,
          priceMax: formValues.priceMax ? parseInt(formValues.priceMax) : null,
          duration: formValues.duration,
          gender: parseInt(formValues.gender),
        },
      ])
    );

    try {
      const response = await fetch("https://api.salon-era.ru/services", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Ошибка при добавлении услуги");
      }
      reset();
      setServices((prevServices) => [
        ...prevServices,
        {
          name: formValues.name,
          description: formValues.description,
          category: formValues.category,
          priceLow: parseInt(formValues.priceLow) || 0,
          priceMax: formValues.priceMax ? parseInt(formValues.priceMax) : null,
          duration: parseInt(formValues.duration),
          gender: parseInt(formValues.gender),
        },
      ]);

      toggleClose();
      reset();
    } catch (error) {
      setLoading(false);
      setErrorMessage(true);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <form
      className={styles["service-field__inner"]}
      onSubmit={handleSubmit(formSubmitHandler)}
    >
      <CustomInput
        label="Введите название услуги:"
        name="name"
        type="text"
        error={errors.name}
        isActive={activeInput === "name"}
        setActiveInput={setActiveInput}
        {...register("name", {
          required: "Это поле обязательно.",
          minLength: {
            value: 2,
            message: "Название должен содержать минимум 2 символа.",
          },
        })}
      />

      <CustomInput
        label="Минимальная цена услуги:"
        name="priceLow"
        type="number"
        error={errors.priceLow}
        isActive={activeInput === "priceLow"}
        setActiveInput={setActiveInput}
        min="0"
        {...register("priceLow", {
          required: "Это поле обязательно.",
          minLength: {
            value: 0,
            message: "Минимальная цена должна быть не меньше 0.",
          },
        })}
      />

      <CustomInput
        label="Максимальная цена услуги:"
        name="priceMax"
        type="number"
        error={errors.priceMax}
        isActive={activeInput === "priceMax"}
        setActiveInput={setActiveInput}
        min="0"
        {...register("priceMax", {
          minLength: {
            value: 0,
            message: "Минимальная цена должна быть не меньше 0.",
          },
        })}
      />

      <Controller
        name="category"
        control={control}
        rules={{ required: "Это поле обязательно" }}
        render={({ field }) => (
          <CustomSelect
            {...field}
            control={control}
            name="category"
            map={categoryOptions}
            rules={{ required: "Это поле обязательно" }}
            valueType="id"
          />
        )}
      />

      <div className={styles["btn-block"]}>
        <CustomButton
          label="Добавить категорию"
          onClick={toggleOpenAddCategory}
          className={styles["g-btn"]}
        />
        <CustomButton
          label="Удалить категорию"
          onClick={toggleOpenDeleteCategory}
          className={styles["r-btn"]}
        />
      </div>
      {deleteCategory && (
        <Modal
          toggleClose={toggleCloseDeleteCategory}
          toggleOpen={toggleOpenDeleteCategory}
        >
          <DeleteCategory toggleClose={toggleCloseDeleteCategory} />
        </Modal>
      )}
      {addCategory && (
        <Modal
          toggleClose={toggleCloseAddCategory}
          toggleOpen={toggleOpenAddCategory}
        >
          <AddCategory
            toggleClose={toggleCloseAddCategory}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
          />
        </Modal>
      )}
      <CustomInput
        label="Описание:"
        name="description"
        type="text"
        error={errors.description}
        isActive={activeInput === "description"}
        setActiveInput={setActiveInput}
      />

      <Controller
        name="duration"
        control={control}
        rules={{ required: "Это поле обязательно" }}
        render={({ field }) => (
          <CustomSelect
            {...field}
            defaultValues=""
            control={control}
            name="duration"
            map={dur}
            valueType="index"
            rules={{ required: "Это поле обязательно" }}
          />
        )}
      />

      <CustomInput
        label="Пол"
        type="radio"
        name="gender"
        control={control}
        error={errors.gender}
        {...register("gender", { required: "Выберите пол." })}
      />

      <CustomButton
        className={styles["gr-btn"]}
        type="submit"
        label="Добавить услугу"
      />
    </form>
  );
};

export default AddService;
