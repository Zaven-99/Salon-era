import React from "react";
import { Controller, useForm } from "react-hook-form";
import SelectCategory from "../../../selectCategory/SelectCategory";
import CustomInput from "../../../customInput/CustomInput";
import CustomButton from "../../../customButton/CustomButton";
import CustomSelect from "../../../customSelect/CustomSelect";
import styles from "./addService.module.scss";

const AddService = ({
  formSubmitHandler,
  activeInput,
  setActiveInput,
  positionMap,
  durationMap,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      priceLow: "",
      priceMax: "",
      category: "",
      description: "",
      duration: "1",
      gender: "",
    },
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
        rules={{ required: "Это поле обязательно." }}
        render={({ field }) => (
          <SelectCategory {...field} optionsMap={positionMap} />
        )}
      />
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
            control={control}
            name="duration"
            map={durationMap}
            rules={{ required: "Это поле обязательно" }}
          />
        )}
      />
      <CustomInput
        label="Пол"
        type="radio"
        name="gender"
        control={control}
        {...register("gender", { required: "Выберите пол." })}
      />

      <CustomButton
        className={styles["accept-add__service"]}
        type="submit"
        label="Добавить услугу"
      />
    </form>
  );
};

export default AddService;
