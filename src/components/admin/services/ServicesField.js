import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import ServiceList from "./serviceList/ServiceList";
import Modal from "../../modal/Modal";
import CustomButton from "../../customButton/CustomButton";

import styles from "./servicesField.module.scss";
import Spinner from "../../spinner/Spinner";
import FilterBlock from "./filterBlock/FilterBlock";
import AddService from "./addService/AddService";

const ServiceField = () => {
  const { handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      priceLow: "",
      priceMax: "",
      category: "",
      description: "",
      duration: null,
      gender: "",
    },
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addService, setAddService] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // selectedCategory может быть строкой или числом
  const [categories, setCategories] = useState([]);

  const generateDurationOptions = () => {
    const durations = ["Выберите продолжительность"];

    for (let hours = 0; hours <= 9; hours++) {
      for (let minutes = 0; minutes <= 1; minutes++) {
        const totalMinutes = hours * 60 + minutes * 30;
        const hoursText = Math.floor(totalMinutes / 60);
        const minutesText = totalMinutes % 60;

        if (hoursText === 0 && minutesText === 0) continue;

        let durationText = "";

        if (hoursText > 0) {
          durationText += `${hoursText} ${getHourText(hoursText)}`;
        }
        if (minutesText > 0) {
          durationText += ` ${minutesText} минут`;
        }

        durations.push(durationText.trim());
      }
    }

    return durations;
  };

  // Функция для корректного склонения слова "час"
  const getHourText = (hours) => {
    if (hours === 1) return "час";
    if (hours >= 2 && hours <= 4) return "часа";
    return "часов";
  };

  const durationToText = (step) => {
    const hours = Math.floor(step / 2);
    const minutes = (step % 2) * 30;

    let result = "";

    if (hours > 0) {
      result += `${hours} ${getHourText(hours)}`;
    }
    if (minutes > 0) {
      result += ` ${minutes} минут`;
    }

    return result.trim();
  };

  const dur = generateDurationOptions();

  const fetchCategory = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/catalogs/all");

      if (!response.ok) {
        throw new Error(`Ошибка http! статус: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const categoryOptions = categories.filter(
    (item) => item.category === "Категория услуг"
  );

  const getCategoryTextById = (id) => {
    const categoryId = Number(id); // Приводим id категории к числу
    const category = categories.find((item) => item.id === categoryId);
    return category ? category.value : "Категория не найдена";
  };

  const toggleOpen = () => {
    setAddService(true);
  };
  const toggleClose = () => {
    setAddService(false);
  };

  // фильтрация по категориям
  const uniqueCategories = [
    ...new Set(services.map((service) => service.category)),
  ];

  const filteredServices = selectedCategory
    ? services.filter(
        (service) => Number(service.category) === Number(selectedCategory) // Приводим оба значения к числу для корректного сравнения
      )
    : services;

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["service-field"]}>
      {errorMessage && <>Что-то не так...</>}
      <div className={styles.wrapper}>
        <CustomButton
          className={styles["gr-btn"]}
          label="Добавить услугу"
          onClick={toggleOpen}
        />
        <FilterBlock
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          uniqueCategories={uniqueCategories}
          getCategoryTextById={getCategoryTextById}
        />
      </div>

      {addService && (
        <Modal toggleClose={toggleClose} toggleOpen={toggleOpen}>
          <h2>Добавить Услугу</h2>
          <AddService
            handleSubmit={handleSubmit}
            setLoading={setLoading}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            categoryOptions={categoryOptions}
            setServices={setServices}
            toggleClose={toggleClose}
            setErrorMessage={setErrorMessage}
            dur={dur}
          />
        </Modal>
      )}

      <ServiceList
        services={filteredServices}
        setServices={setServices}
        toggleClose={toggleClose}
        toggleOpen={toggleOpen}
        categoryOptions={categoryOptions}
        dur={dur}
        durationToText={durationToText}
        getCategoryTextById={getCategoryTextById}
      />
    </div>
  );
};

export default ServiceField;
