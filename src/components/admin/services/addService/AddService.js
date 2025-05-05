import React from "react";
import { Controller } from "react-hook-form";
import CustomInput from "../../../customInput/CustomInput";
import CustomButton from "../../../customButton/CustomButton";
import CustomSelect from "../../../customSelect/CustomSelect";
import AddCategory from "./addCategory/AddCategory";
import Modal from "../../../modal/Modal";
import DeleteCategory from "./deleteCategory/DeleteCategory";
import { AddServiceState } from "../../../hooks/services/addServiceState";

import styles from "./addService.module.scss";

const AddService = ({
  setLoading,
  categories,
  dur,
  setServices,
  toggleClose,
  setErrorMessage,
}) => {
  const {
    register,
    handleSubmit,
    control,
    errors,
    activeInput,
    setActiveInput,
    addCategory,
    deleteCategory,
    toggleOpenAddCategory,
    toggleCloseAddCategory,
    toggleOpenDeleteCategory,
    toggleCloseDeleteCategory,
    formSubmitHandler,
  } = AddServiceState({
    setServices,
    setLoading,
    toggleClose,
    setErrorMessage,
  });

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
            map={categories}
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
        className={styles["b-btn"]}
        type="submit"
        label="Добавить услугу"
      />
    </form>
  );
};

export default AddService;
