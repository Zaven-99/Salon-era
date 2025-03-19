import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import CustomSelect from "../../../../customSelect/CustomSelect";
import CustomInput from "../../../../customInput/CustomInput";

import styles from "./editModal.module.scss";
import BtnBlock from "../../../../btnBlock/BtnBlock";
const EditModal = ({
  setLoading,
  editedService,
  setServices,
  setServiceId,
  setEditedService,
  toggleClose,
  durationMap,
  service,
}) => {
  const {
    register,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      id: "",
      name: "",
      category: "",
      description: "",
      duration: "1",
      priceLow: null,
      priceMax: null,
      gender: "",
      imageLink: "",
    },
  });
  const [activeInput, setActiveInput] = useState("");

  const handleSave = async (id) => {
    setLoading(true);

    const serviceToUpdate = { ...editedService, id };

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        ...serviceToUpdate,
      })
    );
    try {
      const response = await fetch(`https://api.salon-era.ru/services/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Ошибка при сохранении услуги");

      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id ? editedService : service
        )
      );
      setServiceId(null);
      setEditedService({});
      toggleClose();
      reset();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedService((prev) => ({ ...prev, [name]: value }));
  };

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
        {...register("name", {
          required: "Это поле обязательно.",
          minLength: {
            value: 2,
            message: "Имя должен содержать минимум 2 символа.",
          },
        })}
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
        value={editedService.priceMax}
        isActive={activeInput === "priceMax"}
        setActiveInput={setActiveInput}
        handleChange={handleChange}
        min="0"
        {...register("priceMax", {
          minLength: {
            value: 0,
            message: "Минимальная цена должна быть не меньше 0.",
          },
        })}
      />

      <CustomInput
        label="Категория:"
        name="category"
        type="text"
        error={errors.category}
        value={editedService.category}
        isActive={activeInput === "category"}
        setActiveInput={setActiveInput}
        handleChange={handleChange}
        {...register("category", {
          required: "Это поле обязательно.",
          minLength: {
            value: 3,
            message: "Название должен содержать минимум 3 символа.",
          },
        })}
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
        {...register("description", {
          required: "Это поле обязательно.",
          minLength: {
            value: 3,
            message: "Название должен содержать минимум 3 символа.",
          },
        })}
      />

      <Controller
        name="duration"
        control={control}
        rules={{ required: "Это поле обязательно" }}
        render={({ field }) => (
          <CustomSelect
            {...field}
            name="duration"
            handleChange={handleChange}
            edited={editedService.duration}
            control={control}
            map={durationMap}
            rules={{ required: "Это поле обязательно" }}
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
        {...register("gender", {
          required: "Выберите пол.",
        })}
      />

      <BtnBlock
        className1={styles["save-service"]}
        className2={styles["cancel"]}
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
