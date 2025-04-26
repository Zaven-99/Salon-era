import React from "react";
import { Controller, useForm } from "react-hook-form";

import CustomSelect from "../../../../customSelect/CustomSelect";
import CustomInput from "../../../../customInput/CustomInput";

import { EditModalState } from "../../../../hooks/services/editModalState";
import styles from "./editModal.module.scss";
import BtnBlock from "../../../../btnBlock/BtnBlock";
const EditModal = ({
  setLoading,
  editedService,
  setServices,
  setServiceId,
  setEditedService,
  toggleClose,
  categories,
  service,
  dur,
}) => {
  const {
    control,
    reset,
    formState: { errors },
  } = useForm({});

  const { activeInput, setActiveInput, handleSave, handleChange } =
    EditModalState({
      editedService,
      setEditedService,
      setLoading,
      setServices,
      setServiceId,
      toggleClose,
      reset,
    });

  return (
    <div>
      <h2>Редактировать</h2>
      <CustomInput
        label="Введите Название услуги:"
        error={errors.name}
        type="text"
        name="name"
        value={editedService.name}
        handleChange={handleChange}
        isActive={activeInput === "name"}
        setActiveInput={setActiveInput}
      />

      <CustomInput
        label="Минимальная цена услуги:"
        error={errors.priceLow}
        type="number"
        name="priceLow"
        value={editedService.priceLow}
        handleChange={handleChange}
        isActive={activeInput === "priceLow"}
        setActiveInput={setActiveInput}
      />

      <CustomInput
        label="Максимальная цена услуги:"
        name="priceMax"
        type="number"
        error={errors.priceMax}
        value={editedService.priceMax}
        isActive={activeInput === "priceMax"}
        setActiveInput={setActiveInput}
        handleChange={handleChange}
        min="0"
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <CustomSelect
            {...field}
            handleChange={handleChange}
            edited={editedService.category}
            control={control}
            valueType="id"
            name="category"
            map={categories}
          />
        )}
      />
      <CustomInput
        label="Описание:"
        name="description"
        type="text"
        error={errors.description}
        value={editedService.description}
        isActive={activeInput === "description"}
        setActiveInput={setActiveInput}
        handleChange={handleChange}
      />

      <Controller
        name="duration"
        control={control}
        render={({ field }) => (
          <CustomSelect
            {...field}
            name="duration"
            handleChange={handleChange}
            edited={editedService.duration}
            control={control}
            map={dur}
            valueType="index"
          />
        )}
      />

      <CustomInput
        label="Пол"
        type="radio"
        name="gender"
        value={editedService.gender}
        handleChange={handleChange}
        control={control}
      />

      <BtnBlock
        className1={styles["g-btn"]}
        className2={styles["r-btn"]}
        className4={styles["btn-block"]}
        label1="Сохранить"
        label2="Отменить"
        fnc1={() => handleSave(service.id)}
        fnc2={() => setServiceId(null)}
      />
    </div>
  );
};

export default EditModal;
