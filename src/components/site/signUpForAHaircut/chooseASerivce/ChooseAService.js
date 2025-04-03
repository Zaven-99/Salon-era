import React, { useState, useEffect } from "react";
import {
  addService,
  removeService,
} from "../../../../store/slices/serviceSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Service from "./service/Service";
import AOS from "aos";
import CustomButton from "../../../customButton/CustomButton";
import Spinner from "../../../spinner/Spinner";

import styles from "./chooseAService.module.scss";
import FilterBlock from "../../../admin/services/filterBlock/FilterBlock";

const ChooseAService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );

  const getHourText = (hours) => {
    if (hours === 1) return "час";
    if (hours >= 2 && hours <= 4) return "часа";
    return "часов";
  };

  const getDurationText = (step) => {
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

  const getCategoryTextById = (id) => {
    const categoryId = Number(id);
    const category = categories.find((item) => item.id === categoryId);
    return category ? category.value : "Категория не найдена";
  };

  const toggleChooseService = (service) => {
    const isServiceSelected = selectedServices.some((s) => s.id === service.id);
    if (isServiceSelected) {
      dispatch(removeService(service.id));
    } else {
      dispatch(addService(service));
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: false,
      offset: 10,
    });
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.salon-era.ru/services/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка: ${response.status} - ${response.statusText} (${errorText})`
        );
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Ожидался JSON, но сервер вернул: ${contentType}`);
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

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

  // Группировка сервисов по полу и категории
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.gender]) {
      acc[service.gender] = {};
    }
    if (!acc[service.gender][service.category]) {
      acc[service.gender][service.category] = [];
    }
    acc[service.gender][service.category].push(service);
    return acc;
  }, {});

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  // Уникальные категории для фильтрации
  const uniqueCategories = [
    ...new Set(services.map((service) => service.category)),
  ];

  // Фильтрация сервисов на основе выбранной категории
  const filteredGroupedServices = Object.keys(groupedServices).reduce(
    (acc, genderKey) => {
      acc[genderKey] = Object.keys(groupedServices[genderKey]).reduce(
        (categoryAcc, category) => {
          // Если категория выбрана, то фильтруем только по ней
          if (!selectedCategory || selectedCategory === category) {
            categoryAcc[category] = groupedServices[genderKey][category];
          }
          return categoryAcc;
        },
        {}
      );
      return acc;
    },
    {}
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className={styles["choose-service"]}>
      <h1 data-aos="fade-right" className={styles.signUpForAHaircut}>
        Записаться
      </h1>

      <div className={styles["sign-up_for__haircut"]}>
        <FilterBlock
          uniqueCategories={uniqueCategories}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          getCategoryTextById={getCategoryTextById}
        />
        <ul>
          {Object.keys(filteredGroupedServices).map((genderKey) => {
            const genderServices = filteredGroupedServices[genderKey];

            const hasServices = Object.keys(genderServices).length > 0;

            if (!hasServices) return null;

            return (
              <div key={genderKey}>
                <span data-aos="fade-right" className={styles.gender}>
                  {genderKey === "1" ? "Мужские услуги" : "Женские услуги"}
                </span>

                {Object.keys(genderServices).map((category) => {
                  // Приводим category к числу
                  const selectedInCategory = selectedServices.some(
                    (service) =>
                      Number(service.category) === Number(category) &&
                      Number(service.gender) === Number(genderKey)
                  );

                  return (
                    <div
                      data-aos="fade-right"
                      className={styles["price-list"]}
                      key={category}
                    >
                      <div className={styles["selected-services__container"]}>
                        <h3 className={styles.category}>
                          {getCategoryTextById(category)}
                        </h3>

                        {selectedInCategory && (
                          <div className={styles["button-wrapper"]}>
                            <div className={styles["next-button"]}>
                              <CustomButton
                                className={styles["next-to__barber"]}
                                onClick={() => navigate("/select-barbers")}
                                label="Перейти к парикмахерам"
                                type="button"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <Service
                        groupedServices={filteredGroupedServices}
                        genderKey={genderKey}
                        category={category}
                        toggleChooseService={toggleChooseService}
                        selectedServices={selectedServices}
                        getDurationText={getDurationText}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ChooseAService;
