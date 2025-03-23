import React, { useState } from "react";
import { useForm } from "react-hook-form";

import ServiceList from "./serviceList/ServiceList";
import Modal from "../../modal/Modal";
import CustomButton from "../../customButton/CustomButton";

import styles from "./servicesField.module.scss";
import Spinner from "../../spinner/Spinner";
import FilterBlock from "./filterBlock/FilterBlock";
import AddService from "./addService/AddService";

const ServiceField = () => {
  const { handleSubmit, reset } = useForm({
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

  const positionMap = [
    "Выберите категортю",
    "Женские стрижки",
    "Укладка",
    "Краска волос 1 тон",
    "Мелирование",
    "Осветление",
    "Мелирование + тонирование",
    "Осветление + Тонирование",
    "Шлифовка волос",
    "Другое",
    "Мужские стрижки",
    "Остальное",
    "Маникюр",
    "Педикюр",
    "Укрепление ногтей",
    "Оформление бровей",
    "Наращивание ресниц",
  ];

   

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addService, setAddService] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const toggleOpen = () => {
    setAddService(true);
  };
  const toggleClose = () => {
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
          onClick={toggleOpen}
        />
        <FilterBlock
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          uniqueCategories={uniqueCategories}
        />
      </div>

      {addService && (
        <Modal toggleClose={toggleClose} toggleOpen={toggleOpen}>
          <h2>Добавить Услугу</h2>
          <AddService
            handleSubmit={handleSubmit}
            formSubmitHandler={formSubmitHandler}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            positionMap={positionMap}
            durationMap={durationMap}
          />
        </Modal>
      )}

      <ServiceList
        services={filteredServices}
        setServices={setServices}
        toggleClose={toggleClose}
        toggleOpen={toggleOpen}
      />
    </div>
  );
};

export default ServiceField;
