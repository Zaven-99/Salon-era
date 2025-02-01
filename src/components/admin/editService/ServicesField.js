import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import ServiceList from "./serviceList/ServiceList";
import Modal from "../../modal/Modal";
import CustomButton from "../../customButton/CustomButton";
import CustomInput from "../../customInput/CustomInput";
import CustomSelect from "../../customSelect/CustomSelect";

import styles from "./servicesField.module.scss";
import Spinner from "../../spinner/Spinner";

const ServiceField = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
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

  const durationMap = [
    "30 минут",
    "1 час",
    "1ч 30 минут",
    "2 часа",
    "2ч 30 минут",
    "3ч",
    "3ч 30 минут",
    "4ч",
    "4ч 30 минут",
    "5ч",
    "5ч 30 минут",
    "6ч",
    "6ч 30 минут",
    "7ч",
    "7ч 30 минут",
    "8ч",
  ];

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addService, setAddService] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const toggleOpenSignInForm = () => {
    setAddService(true);
  };
  const toggleCloseSignInForm = () => {
    setAddService(false);
  };

  const formSubmitHandler = async (formValues) => {
    setLoading(true);
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        name: formValues.name,
        description: formValues.description,
        category: formValues.category,
        priceLow: parseInt(formValues.priceLow) || 0,
        priceMax: formValues.priceMax ? parseInt(formValues.priceMax) : null,
        duration: parseInt(formValues.duration),
        gender: parseInt(formValues.gender),
      })
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

      setServices((prevServices) => [...prevServices, formData]);
      toggleCloseSignInForm();
      reset();
    } catch (error) {
      setLoading(false);
      setErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };
  //фильтрование по категориям
  const uniqueCategories = [
    ...new Set(services.map((service) => service.category)),
  ];
  const filteredServices = selectedCategory
    ? services.filter((service) => service.category === selectedCategory)
    : services;

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["service-field"]}>
      {errorMessage && <>Что-то не так...</>}
      <div className={styles.wrapper}>
        <CustomButton
          className={styles["add-service"]}
          label="Добавить услугу"
          onClick={toggleOpenSignInForm}
        />
        <div className={styles['filter-block']}>
          <p className={styles['filter-title']}>Отфильтруйте по категориям</p>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filter}
          >
            <option value="">Все категории</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {addService && (
        <Modal
          toggleCloseSignInForm={toggleCloseSignInForm}
          toggleOpenSignInForm={toggleOpenSignInForm}
        >
          <h2>Добавить Услугу</h2>
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

            <CustomInput
              label="Категория:"
              name="category"
              type="text"
              error={errors.category}
              isActive={activeInput === "category"}
              setActiveInput={setActiveInput}
              min="0"
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
        </Modal>
      )}

      <ServiceList
        services={filteredServices}
        setServices={setServices}
        toggleCloseSignInForm={toggleCloseSignInForm}
        toggleOpenSignInForm={toggleOpenSignInForm}
      />
    </div>
  );
};

export default ServiceField;
